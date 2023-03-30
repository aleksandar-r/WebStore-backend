import { NextFunction, Response } from 'express'
import { IReqWithUser } from '../types/auth'
import status from '../config/common/status'
import text from '../config/common/text'
import auth from '../config/common/auth'

class AuthorizationMiddleware {
  constructor() {}

  private _checkRoles(roles: string[], role: string) {
    return roles?.includes(role)
  }

  isAdmin(req: IReqWithUser, res: Response, next: NextFunction) {
    const checkRoles = this._checkRoles(req.roles, auth.role.admin)

    if (!req.user || !checkRoles) {
      return res.status(status.unauthorized).json({ message: text.res.unauthorized })
    }

    next()
  }

  isEditor(req: IReqWithUser, res: Response, next: NextFunction) {
    const checkRoles = this._checkRoles(req.roles, auth.role.editor)

    if (!req.user || !checkRoles) {
      return res.status(status.unauthorized).json({ message: text.res.unauthorized })
    }

    next()
  }

  //* *** WIP ***
  //* For any role
  checkAuthRole(role: string) {
    return (req: IReqWithUser, res: Response, next: NextFunction) => {
      const checkRoles = this._checkRoles(req.roles, role)

      if (!req.user || !checkRoles) {
        return res.status(status.unauthorized).json({ message: text.res.unauthorized })
      }

      next()
    }
  }
}

export default AuthorizationMiddleware
