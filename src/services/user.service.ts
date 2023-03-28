import bcrypt from 'bcrypt'
import UserRepository from '../repository/user.repository'
import { IUserService } from '../types/user'
import { text } from '../common'
import { IUser } from '../types/auth'

const userRepository = new UserRepository()

class UserService implements IUserService {
  constructor() {}

  // @desc   Get all users
  // @route  GET /user
  // @access Private Editor
  async getAllUsers() {
    const users = await userRepository.getAllWSelect('-password')

    return users
  }

  // @desc   Get a single user
  // @route  GET /user/single
  // @access Private Editor
  async getUserByID(id: string) {
    const user = await userRepository.getByIdWSelect(id, '-password')

    return user
  }

  // @desc   Create a new user
  // @route  POST /user
  // @access Private Editor
  async createNewUser(user: Pick<IUser, 'username' | 'email' | 'password' | 'roles'>) {
    const { username, email, password, roles = ['User'] } = user
    const isBodyComplete = [username, email, password].every(Boolean)

    if (!isBodyComplete) {
      throw new Error(text.res.allFieldsReq)
    }

    const duplicateEmail = await userRepository.getByEmail(email)
    if (duplicateEmail) {
      throw new Error(text.res.usernameDuplicate)
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // 10 is number of salt rounds

    const userObject = { username, password: hashedPwd, roles, email, active: false }

    const createUser = await userRepository.create(userObject)

    if (!createUser) {
      throw new Error(text.res.invalidUserData)
    }
  }

  // @desc   Update a user
  // @route  PATCH /user
  // @access Private Editor
  async updateUser(user: Pick<IUser, 'id' | 'username' | 'roles' | 'active' | 'password'>) {
    const { id, username, roles, active, password } = user

    const isActiveBoolean = typeof active !== 'boolean'
    const isRolesArray = !Array.isArray(roles) || !roles.length
    const missingData = [!id, !username, isRolesArray, isActiveBoolean].some(Boolean)

    if (missingData) {
      throw new Error(text.res.allFieldsExcPwd)
    }

    const updateUser = await userRepository.findById(id as string)
    if (!updateUser) {
      throw new Error(text.res.userNotFound)
    }

    const duplicateUser = await userRepository.getByUserName(username)

    // check if there are two users with same username but different ids
    const isDuplicateUserId = [duplicateUser, duplicateUser?._id?.toString() !== id].every(Boolean)

    if (isDuplicateUserId) {
      throw new Error(text.res.usernameDuplicate)
    }

    if (password) {
      updateUser.password = await bcrypt.hash(password, 10)
    }

    await userRepository.update(id as string, user)
    return text.res.userUpdatedFn(username)
  }

  // @desc   Delete a user
  // @route  DELETE /user
  // @access Private Admin
  async deleteUser(id: string) {
    if (!id) {
      throw new Error(text.res.userIDReq)
    }

    const userExists = await userRepository.findById(id)

    if (!userExists) {
      throw new Error(text.res.userNotFound)
    }

    const result = await userRepository.remove(id)

    return text.res.userDeletedFn(result.username, id)
  }

  //* *** Profile Services *** *//

  // @desc   Get user profile
  // @route  GET /user/profile
  // @access Private
  async getUserProfile(id: string) {
    const user = await userRepository.findById(id)

    if (!user) {
      throw new Error(text.res.userNotFound)
    }
    return user
  }

  // @desc   Update user profile
  // @route  PATCH /user/profile
  // @access Private
  async updateUserProfile(id: string, username: string, email: string) {
    const user = await userRepository.findById(id)

    if (!user) {
      throw new Error(text.res.userNotFound)
    }

    const updatedUser = await userRepository.update(id, { username, email })
    return updatedUser
  }

  // @desc   Update user password
  // @route  PATCH /user/password/reset
  // @access Private
  async updateUserPassword(id: string, password: string) {
    const user = await userRepository.findById(id)

    if (!user) {
      throw new Error(text.res.userNotFound)
    }

    if (!password) {
      throw new Error(text.res.pwdReq)
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      throw new Error(text.res.pwdMatch)
    }

    const hashedPwd = await bcrypt.hash(password, 10)
    await userRepository.update(id, { password: hashedPwd })
  }

  //TODO Implement service
  // @desc   Activate user
  // @route  PATCH /user/activate
  // @access Private
  async activateUser() {
    throw new Error('This service is not implemented yet!')
  }
}

export default UserService
