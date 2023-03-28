import { Router } from 'express'
import verifyJWT from '../middleware/verifyJWT'
import { isEditor, isAdmin } from '../middleware/authorize'
import { getAllUsers, createNewUser, updateUser, deleteUser, getUserById } from '../controllers/userController'

const router = Router()

router.use(verifyJWT)

router
  .route('/')
  .get(isEditor, getAllUsers)
  .post(isEditor, createNewUser)
  .patch(isEditor, updateUser)
  .delete(isAdmin, deleteUser)

router.route('/single').get(isEditor, getUserById)

export default router
