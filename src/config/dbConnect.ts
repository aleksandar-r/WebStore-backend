import mongoose from 'mongoose'
import products from '../data/products'
import { IDBConnection } from './IDBConnection'
import Product from '../models/productModel'

export class DBConnection implements IDBConnection {
  constructor() { }

  async seedDB() {
    await Product.deleteMany({})
    await Product.insertMany(products)
  }

  async connect() {
    try {
      // if new fields, not specified in schema are added
      // strictQuery option will determine will they be accepted
      mongoose.set('strictQuery', true)
      await mongoose.connect(process.env.DATABASE_URI as string)
    } catch (error) {
      console.error(error)
    }
  }
  closeDatabase() {
    throw new Error('Method not implemented.')
  }
  clearDatabase() {
    throw new Error('Method not implemented.')
  }
  startListening(app: string) {
    throw new Error('Method not implemented.')
  }

}
