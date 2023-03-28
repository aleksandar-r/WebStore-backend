import { NextFunction, Response } from 'express'
import { ReqWithUser } from '../types/auth'
import status from '../common/status'
import text from '../common/text'
import auth from '../common/auth'

export const isAdmin = (req: ReqWithUser, res: Response, next: NextFunction) => {
  const checkRoles = req.roles?.includes(auth.role.admin)

  if (!req.user || !checkRoles) {
    return res.status(status.unauthorized).json({ message: text.res.unauthorized })
  }

  next()
}

export const isEditor = (req: ReqWithUser, res: Response, next: NextFunction) => {
  const checkRoles = req.roles?.includes(auth.role.editor)

  if (!req.user || !checkRoles) {
    return res.status(status.unauthorized).json({ message: text.res.unauthorized })
  }

  next()
}

//* *** WIP ***
//* For any role
export const checkRole = (role: string) => {
  return (req: ReqWithUser, res: Response, next: NextFunction) => {
    const checkRoles = req.roles?.includes(role)

    if (!req.user || !checkRoles) {
      return res.status(status.unauthorized).json({ message: text.res.unauthorized })
    }

    next()
  }
}
