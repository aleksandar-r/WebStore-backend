import { register } from './../controllers/authController'
import { Router } from 'express'
import { login, refresh, logout } from '../controllers/authController'
import loginLimiter from '../middleware/loginLimiter'

const router = Router()

router.route('/').post(loginLimiter, login)

router.route('/register').post(register)

router.route('/refresh').get(refresh)

router.route('/logout').post(logout)

export default router
