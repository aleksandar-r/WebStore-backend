import mongoose from 'mongoose'
import Product from './models/productModel'
import products from './data/products'

mongoose
  .connect(process.env.DATABASE_URI as string)
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
