import { Types } from 'mongoose'
import { IUser } from './auth'

export interface IUserRepository {
  getByEmail(email: string): Promise<IUser>
  getByUserName(username: string): Promise<IUser>
  getAllWSelect(selection: string): Promise<Partial<IUser[]>>
  getByIdWSelect(id: string, selection: string): Promise<Partial<IUser> | null>
}

export interface IUserService {
  getAllUsers: () => Promise<(Partial<IUser> | undefined)[]>
  getUserByID: (id: string) => Promise<Partial<IUser> | null>
  createNewUser: (user: Partial<IUser>) => Promise<void>
  updateUser: (user: Pick<IUser, 'id' | 'username' | 'roles' | 'active' | 'password'>) => Promise<string | void>
  deleteUser: (id: string) => Promise<string | void>
  getUserProfile: (id: string) => Promise<IUser>
  updateUserProfile: (id: string, username: string, email: string) => Promise<IUser>
  updateUserPassword: (id: string, password: string) => Promise<void>
  activateUser: () => Promise<void>
}

export interface IUserReq {
  username: string
  id: string
}
