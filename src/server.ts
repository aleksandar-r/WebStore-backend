import dotenv from 'dotenv'
import 'express-async-errors'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { logger, logEvents } from './middleware/logger'
import errorHandler from './middleware/errorHandler'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import corsOptions from './config/corsOptions'
import connectDB from './config/dbConnect'
import mongoose from 'mongoose'
import { text, status } from './config/common'
import { rootRoute, userRoute, orderRoute, uploadRoute, productRoute } from './routes'
import { AuthEnticationRoute } from './routes/authRoutes'
import AuthenticationService from './services/auth.service'
import CryptUtil from './utils/crypt.util'

const PORT = process.env.PORT || 3500
const app = express()

dotenv.config()
connectDB()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
  app.use(logger)
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, '/public')))

const cryptService = new CryptUtil();
const authService = new AuthenticationService(cryptService)
const authRoute = new AuthEnticationRoute(authService);

app.use('/', rootRoute)
app.use('/auth', authRoute.authenticationRoute)
app.use('/user', userRoute)
app.use('/order', orderRoute)
app.use('/upload', uploadRoute)
app.use('/product', productRoute)

// WIP Introducing paypal as payment form
// TODO app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.all('*', (req, res) => {
  res.status(status.notFound)

  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ message: text.res.notFound })
  } else {
    res.type('txt').send(text.res.notFound)
  }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', (error) => {
  console.error(error)
  logEvents(`${error.no} : ${error.code}\t${error.syscall}\t${error.hostname}`, 'mongoErrLog.log')
})
