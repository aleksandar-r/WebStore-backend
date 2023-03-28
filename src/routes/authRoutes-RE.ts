import { Request, Response, Router } from 'express'
import AuthenticationService from '../services/auth.service'
import loginLimiter from '../middleware/loginLimiter'
import { auth, text, status } from '../common'

export const authenticationRoute = Router()
const authService = new AuthenticationService()

authenticationRoute.post('/', loginLimiter, async (req: Request, res: Response) => {
  const { username, password } = req.body

  const { accessToken, refreshToken } = await authService.login(username, password)

  // Create secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true, // accesible only by web browser
    secure: true, // https
    sameSite: 'none', // cross-site cookie
    maxAge: auth.cookieMaxAge, // cookie expiry
  })

  res.json({ accessToken })
})

authenticationRoute.post('/register', async (req: Request, res: Response) => {
  const { username, password, email, roles } = req.body
  const { accessToken, refreshToken } = await authService.register(username, password, email, roles)

  res.cookie('jwt', refreshToken, {
    httpOnly: true, // accesible only by web browser
    secure: true, // https
    sameSite: 'none', // cross-site cookie
    maxAge: auth.cookieMaxAge, // cookie expiry
  })
  res.status(status.created).json({ accessToken })
})

authenticationRoute.post('/logout', async (req: Request, res: Response) => {
  const cookies = req.cookies

  if (!cookies?.jwt) return res.sendStatus(status.noContent)

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })

  res.status(status.OK).json({ message: text.res.cookieCleared })
})

authenticationRoute.get('/refresh', async (req: Request, res: Response) => {
  const cookies = req.cookies

  if (!cookies?.jwt) {
    return res.status(status.unauthorized).json({ message: text.res.unauthorized })
  }

  const accessToken = authService.refresh(cookies.jwt)
  res.json({ accessToken })
})
