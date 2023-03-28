import { Types } from 'mongoose'
import { Request, Response } from 'express'

interface IBase {
  _id?: Types.ObjectId
}

export interface IUser extends IBase {
  id?: string
  username: string
  password: string
  email: string
  roles: string[]
  active: boolean
}

export interface IReqWithUser extends Request {
  user: {
    id: string
    username: string
  }
  roles: string[]
}

export interface IVerifyDecodedJWT {
  username: string
  roles?: string[]
}

export interface ITokensObject {
  accessToken: string
  refreshToken: string
}

export interface IAuthenticationService {
  register(username: string, password: string, email: string, roles: string[]): Promise<ITokensObject>
  login(username: string, password: string): Promise<ITokensObject>
  // logout(): Promise<string>
  refresh(refreshToken: string): Promise<string>
}
