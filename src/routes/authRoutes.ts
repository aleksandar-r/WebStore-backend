import { Request, Response, Router } from 'express'
import AuthenticationService from '../services/auth.service'
import loginLimiter from '../middleware/loginLimiter'
import { text, status } from '../config/common'
import cookieOptions from '../config/cookieOptions'

const authenticationRoute = Router()
const authService = new AuthenticationService()

// Login
authenticationRoute.post('/', loginLimiter, async (req: Request, res: Response) => {
  const { username, password } = req.body

  const { accessToken, refreshToken } = await authService.login(username, password)

  // Create secure cookie with refresh token
  res.cookie('jwt', refreshToken, cookieOptions)

  res.json({ accessToken })
})

// Register
authenticationRoute.post('/register', async (req: Request, res: Response) => {
  const { username, password, email, roles } = req.body
  const { accessToken, refreshToken } = await authService.register(username, password, email, roles)

  res.cookie('jwt', refreshToken, cookieOptions)
  res.status(status.created).json({ accessToken })
})

// Logout
authenticationRoute.post('/logout', async (req: Request, res: Response) => {
  const cookies = req.cookies

  if (!cookies?.jwt) return res.sendStatus(status.noContent)

  const { httpOnly, sameSite, secure } = cookieOptions
  res.clearCookie('jwt', { httpOnly, sameSite, secure })

  res.status(status.OK).json({ message: text.res.cookieCleared })
})

// Refresh
authenticationRoute.get('/refresh', async (req: Request, res: Response) => {
  const cookies = req.cookies

  if (!cookies?.jwt) {
    return res.status(status.unauthorized).json({ message: text.res.unauthorized })
  }

  const accessToken = authService.refresh(cookies.jwt)
  res.json({ accessToken })
})

export default authenticationRoute
