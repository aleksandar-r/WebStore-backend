import mongoose from 'mongoose'
import Product from './models/productModel'
import products from './data/products'

mongoose
  .connect('mongodb+srv://lexa:test1234@testproject.invdxa9.mongodb.net/web-store?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error(error)
  })

const seedDB = async () => {
  await Product.deleteMany({})
  await Product.insertMany(products)
}

seedDB().then(() => {
  mongoose.connection.close()
})
