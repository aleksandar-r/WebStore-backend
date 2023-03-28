import { Request, Response } from 'express'
import { IFile } from '../types/upload'

export const uploadSingleImage = (req: Request, res: Response) => {
  res.send(`/${req?.file?.path}`)
}

export const uploadMultipleImages = (req: Request, res: Response) => {
  const response = (req?.files as IFile[]).map((img: IFile) => img.path)

  res.send(response)
}
