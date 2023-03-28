import { Router } from 'express'
import { getAllProducts, getTopProducts } from '../controllers/productsController'

const router = Router()

router.route('/').get(getAllProducts)

router.route('/top').get(getTopProducts)

export default router
