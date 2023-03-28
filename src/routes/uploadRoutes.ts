import { Router } from 'express'
import { uploadSingleImage } from '../controllers/uploadController'
import upload from '../middleware/uploadImage'

const router = Router()

router.post('/', upload.single('image'), uploadSingleImage)

router.post('/multiple', upload.array('images', 12))

export default router
