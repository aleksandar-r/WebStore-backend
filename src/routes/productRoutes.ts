import { Router } from 'express'
import verifyJWT from '../middleware/verifyJWT'
import { isAdmin, isEditor } from '../middleware/authorize'
import {
  createProduct,
  createReview,
  deleteProduct,
  getSingleProduct,
  updateProduct,
} from '../controllers/singleProductController'

const router = Router()

router
  .route('/')
  .get(getSingleProduct)
  .post(verifyJWT, isEditor, createProduct)
  .put(verifyJWT, isEditor, updateProduct)
  .delete(verifyJWT, isAdmin, deleteProduct)

router.route('/reviews').post(verifyJWT, createReview)

export default router
