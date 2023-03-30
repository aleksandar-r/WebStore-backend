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
import mongoose from 'mongoose'
import { text, status } from './config/common'
import { rootRoute, userRoute, orderRoute, uploadRoute, productRoute } from './routes'
import { AuthEnticationRoute } from './routes/authRoutes'
import AuthenticationService from './services/auth.service'
import CryptUtil from './utils/crypt.util'
import { IDBConnection } from './config/IDBConnection'

export class Application {
    app = express()
    PORT = process.env.PORT || 3500

    constructor(private dbConnection: IDBConnection) {

    }

    public async initilize() {
        dotenv.config()
        await this.dbConnection.connect();

        if (process.env.NODE_ENV === 'development') {
            this.app.use(morgan('dev'))
            this.app.use(logger)
        }

        this.app.use(cors(corsOptions))
        this.app.use(express.json())
        this.app.use(cookieParser())

        this.app.use('/', express.static(path.join(__dirname, '/public')))

        const cryptService = new CryptUtil();
        const authService = new AuthenticationService(cryptService)
        const authRoute = new AuthEnticationRoute(authService);

        this.app.use('/', rootRoute)
        this.app.use('/auth', authRoute.authenticationRoute)
        this.app.use('/user', userRoute)
        this.app.use('/order', orderRoute)
        this.app.use('/upload', uploadRoute)
        this.app.use('/product', productRoute)

        // WIP Introducing paypal as payment form
        // TODO app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

        this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

        this.app.all('*', (req, res) => {
            res.status(status.notFound)

            if (req.accepts('html')) {
                res.sendFile(path.join(__dirname, 'views', '404.html'))
            } else if (req.accepts('json')) {
                res.json({ message: text.res.notFound })
            } else {
                res.type('txt').send(text.res.notFound)
            }
        })

        this.app.use(errorHandler)
    }

    async startListening() {
        mongoose.connection.once('open', () => {
            console.log('Connected to MongoDB')
            this.app.listen(this.PORT, () => console.log(`Server running on port ${this.PORT}`))
        })

        mongoose.connection.on('error', (error) => {
            console.error(error)
            logEvents(`${error.no} : ${error.code}\t${error.syscall}\t${error.hostname}`, 'mongoErrLog.log')
        })
    }
}


