import { BaseRepository } from './base.repository'
import { IUserRepository } from '../types/user'
import UserModel from '../models/userModel'
import { IUser } from './../types/auth.d'

class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(() => UserModel)
  }

  async getByEmail(email: string): Promise<IUser> {
    return await UserModel.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean()
  }

  async getByUserName(username: string): Promise<IUser> {
    return await UserModel.findOne({ username: username }).collation({ locale: 'en', strength: 2 }).lean()
  }

  async getAllWSelect(selection = ''): Promise<Partial<IUser[]>> {
    return await UserModel.find().select(selection).lean().exec()
  }

  async getByIdWSelect(id: string, selection = ''): Promise<Partial<IUser> | null> {
    return await UserModel.findById(id).select(selection).exec()
  }
}

export default UserRepository
