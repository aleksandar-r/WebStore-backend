import { Router } from 'express'
import verifyJWT from '../middleware/verifyJWT'
import { isEditor } from '../middleware/authorize'
import { getOrders, addOrderItems, getLoggedInUsersOrders } from '../controllers/orderController'

const router = Router()

router.use(verifyJWT)

router.route('/').get(isEditor, getOrders).post(addOrderItems)

router.route('/myorders').all(getLoggedInUsersOrders)

export default router
