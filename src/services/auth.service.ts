import bcrypt from 'bcrypt'
import { ITokensObject, IVerifyDecodedJWT } from './../types/auth'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import { IAuthenticationService, IUser } from '../types/auth'
import UserRepository from '../repository/user.repository'
import { createTokens } from '../utils/helperFns'
import { auth, text } from '../common'
import CryptService from './crypt.service'
import UserModel from '../models/userModel'

const cryptService = new CryptService()
const userRepository = new UserRepository()

class AuthenticationService implements IAuthenticationService {
  constructor() {}

  // @desc Register
  // @route POST /auth/register
  // @access Public
  async register(username: string, password: string, email: string, roles: string[]): Promise<ITokensObject> {
    const isBodyComplete = [username, email, password].every(Boolean)

    if (!isBodyComplete) {
      throw new Error(text.res.allFieldsReq)
    }
    const duplicateEmail = await userRepository.getByEmail(email)
    if (duplicateEmail) {
      throw new Error(text.res.emailExists)
    }
    const hashedPwd = await cryptService.hashValue(password)

    const isRolesInBody = !Array.isArray(roles) || !roles.length
    const userObject: IUser = isRolesInBody
      ? { username, password: hashedPwd, roles: [], email, active: false }
      : { username, password: hashedPwd, roles, email, active: false }

    const createUser = await userRepository.create(userObject)
    if (!createUser) {
      throw new Error(text.res.invalidUserData)
    }

    const tokens = createTokens(createUser as IUser)
    return tokens
  }

  // @desc   Login
  // @route  POST /auth
  // @access Public
  async login(username: string, password: string) {
    const confirmData = [username, password].some(Boolean)
    if (!confirmData) {
      throw new Error(text.res.allFieldsReq)
    }

    const foundUser = await userRepository.getByUserName(username)
    const isFoundUserActive = [foundUser, foundUser?.active].some(Boolean)

    if (!isFoundUserActive) {
      throw new Error(text.res.unauthorized)
    }

    const isMatch = await bcrypt.compare(password, foundUser?.password as string)

    if (!isMatch) {
      throw new Error(text.res.unauthorized)
    }

    const tokens = createTokens(foundUser)
    return tokens
  }

  // @desc   Refresh
  // @route  GET /auth/refresh
  // @access Public - because access token has expired
  async refresh(refreshToken: string): Promise<string> {
    let accessToken = ''

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (error: VerifyErrors, decoded: IVerifyDecodedJWT) => {
        if (error) {
          throw new Error(text.res.forbidden)
        }

        const foundUser = await UserModel.findOne({ username: decoded.username })

        const newAccessToken = jwt.sign(
          {
            UserInfo: {
              id: foundUser?._id,
              username: foundUser?.username,
              roles: foundUser?.roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: auth.accessTokenExpiry },
        )

        accessToken = newAccessToken
      },
    )

    return accessToken
  }
}

export default AuthenticationService
