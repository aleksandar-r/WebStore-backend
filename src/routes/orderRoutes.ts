import { Router } from 'express'
import verifyJWT from '../middleware/verifyJWT'
import { isAdmin } from '../middleware/authorize'
import { getOrderById, updateOrderToDelivered, updateOrderToPaid } from '../controllers/orderController'

const router = Router()

router.use(verifyJWT)

router.route('/').get(getOrderById)

router.route('/pay').put(isAdmin, updateOrderToPaid)

router.route('./deliver').put(updateOrderToDelivered)

export default router
