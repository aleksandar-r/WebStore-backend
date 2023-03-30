import { Request, Response, Router } from 'express'
import upload from '../middleware/uploadImage'
import { IFile } from '../types/upload'

const uploadRoute = Router()

uploadRoute.post('/', upload.single('image'), async (req: Request, res: Response) => {
  res.send(`/${req?.file?.path}`)
})

uploadRoute.post('/multiple', upload.array('images', 12), async (req: Request, res: Response) => {
  const response = (req?.files as IFile[]).map((img: IFile) => img.path)
  res.send(response)
})

export default uploadRoute
