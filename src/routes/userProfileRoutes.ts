import { Router } from 'express'
import verifyJWT from '../middleware/verifyJWT'
import { getUserProfile, updateUserProfile, updateUserPassword } from '../controllers/userProfileController'

const router = Router()

router.use(verifyJWT)

router.route('/').get(getUserProfile).patch(updateUserProfile)

router.route('/password/reset').patch(updateUserPassword)

export default router
