import { Request, Response, Router } from 'express'
import loginLimiter from '../middleware/loginLimiter'
import { text, status } from '../config/common'
import cookieOptions from '../config/cookieOptions'
import { IAuthenticationService } from '../types/auth'

export class AuthEnticationRoute {

  authenticationRoute = Router()
  constructor(private authService: IAuthenticationService) {
    this.initRoutes();
  }

  private initRoutes() {
    // Login
    this.authenticationRoute.post('/', loginLimiter, async (req: Request, res: Response) => {
      const { username, password } = req.body

      const { accessToken, refreshToken } = await this.authService.login(username, password)

      // Create secure cookie with refresh token
      res.cookie('jwt', refreshToken, cookieOptions)

      res.json({ accessToken })
    })

    // Register
    this.authenticationRoute.post('/register', async (req: Request, res: Response) => {
      const { username, password, email, roles } = req.body
      const { accessToken, refreshToken } = await this.authService.register(username, password, email, roles)
      console.log(accessToken);
      res.cookie('jwt', refreshToken, cookieOptions)
      res.status(status.created).json({ accessToken })
    })

    // Logout
    this.authenticationRoute.post('/logout', async (req: Request, res: Response) => {
      const cookies = req.cookies

      if (!cookies?.jwt) return res.sendStatus(status.noContent)

      const { httpOnly, sameSite, secure } = cookieOptions
      res.clearCookie('jwt', { httpOnly, sameSite, secure })

      res.status(status.OK).json({ message: text.res.cookieCleared })
    })

    // Refresh
    this.authenticationRoute.get('/refresh', async (req: Request, res: Response) => {
      const cookies = req.cookies

      if (!cookies?.jwt) {
        return res.status(status.unauthorized).json({ message: text.res.unauthorized })
      }

      const accessToken = this.authService.refresh(cookies.jwt)
      res.json({ accessToken })
    })
  }

}


