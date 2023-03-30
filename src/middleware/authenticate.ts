import jwt from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import { IReqWithUser } from '../types/auth'
import status from '../config/common/status'
import text from '../config/common/text'

class AuthenticateMiddleware {
  constructor() {}

  verifyJWT(req: IReqWithUser, res: Response, next: NextFunction) {
    const authHeader = (req.headers.authorization as string) || (req.headers.Authorization as string)

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(status.unauthorized).json({ message: text.res.unauthorized })
    }

    const token = authHeader?.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded: jwt.JwtPayload) => {
      if (err) return res.status(status.forbidden).json({ message: text.res.forbidden })
      req.user = { id: decoded?.UserInfo?.id, username: decoded?.UserInfo?.username }
      req.roles = decoded?.UserInfo?.roles
      next()
    })
  }
}

export default AuthenticateMiddleware
