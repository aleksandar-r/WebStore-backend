import { Model } from 'mongoose'

export abstract class BaseRepository<T> {
  private _mongooseModel: Model<T>

  constructor(resolveModelFn: () => Model<T>) {
    if (!resolveModelFn) {
      throw new Error('You must specify which collectiion you want to query')
    }

    this._mongooseModel = resolveModelFn()
  }

  create = async (objectToCreate: Partial<T>): Promise<T> => {
    return await this._mongooseModel.create(objectToCreate)
  }

  findById = async (id: string): Promise<T> => {
    return await this._mongooseModel.findById({ _id: id }).lean()
  }

  findAll = async (): Promise<T[]> => {
    return await this._mongooseModel.find().lean()
  }

  remove = async (id: string): Promise<T> => {
    return await this._mongooseModel.remove({ _id: id }).lean()
  }

  update = async (id: string, baseObject: Partial<T>): Promise<T> => {
    return await this._mongooseModel.updateOne({ _id: id }, { baseObject }).lean()
  }
}
