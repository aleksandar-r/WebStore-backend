import { auth } from './common'

type CookieOptions = {
  httpOnly: boolean
  secure: boolean
  sameSite: 'none'
  maxAge: number
}

const cookieOptions: CookieOptions = {
  httpOnly: true, // accesible only by web browser
  secure: true, // https
  sameSite: 'none', // cross-site cookie
  maxAge: auth.cookieMaxAge, // cookie expiry
}

export default cookieOptions
