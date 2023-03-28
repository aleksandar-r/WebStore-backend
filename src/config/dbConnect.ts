import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    // if new fields, not specified in schema are added
    // strictQuery option will determine will they be accepted
    mongoose.set('strictQuery', true)
    await mongoose.connect(process.env.DATABASE_URI as string)
  } catch (error) {
    console.error(error)
  }
}

export default connectDB
