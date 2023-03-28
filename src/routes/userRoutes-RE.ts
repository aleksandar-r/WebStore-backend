import { IReqWithUser } from '../types/auth'
import { Request, Response, Router } from 'express'
import { isEditor, isAdmin } from '../middleware/authorize'
import UserService from '../services/user.service'
import verifyJWT from '../middleware/verifyJWT'
import { text, status } from '../common'

export const userRoute = Router()
const userService = new UserService()

userRoute.use(verifyJWT)

// getAllUsers
userRoute.get('/', isEditor, async (_req: Request, res: Response) => {
  const users = await userService.getAllUsers()
  res.json(users)
})

// getUserByID
userRoute.get('/one', isEditor, async (req: Request, res: Response) => {
  if (!req.body.id) {
    return res.status(status.badReq).json({ message: text.res.userIDReq })
  }

  const user = await userService.getUserByID(req.body.id)
  res.json(user)
})

// createNewUser
userRoute.post('/', isEditor, async (req: Request, res: Response) => {
  const user = req.body

  await userService
    .createNewUser(user)
    .catch((_error) => res.status(status.badReq).json({ message: text.res.invalidUserData }))

  res.status(status.created).json({ message: text.res.userCreatedFn(user.username) })
})

// updateUser
userRoute.patch('/', isEditor, async (req: Request, res: Response) => {
  const user = req.body

  const updateUserText = await userService.updateUser(user)
  res.json(updateUserText)
})

userRoute.delete('/', isAdmin, async (req: Request, res: Response) => {
  const deleteUserText = await userService.deleteUser(req.body.id)

  res.json(deleteUserText)
})

//* *** User Profile routes *** *//
// getUserProfile
userRoute.get('/single', async (req: IReqWithUser, res: Response) => {
  const user = await userService.getUserProfile(req.user.id)

  res.json({
    username: user.username,
    active: user.active,
    email: user.email,
    roles: user.roles,
    id: user.id,
  })
})

// updateUserProfile
userRoute.patch('/single', async (req: IReqWithUser, res: Response) => {
  const { username, email } = req.body

  const user = await userService.updateUserProfile(req.user.id, username, email)

  res.json(user)
})

// updateUserPassword
userRoute.patch('/password', async (req: IReqWithUser, res: Response) => {
  await userService.updateUserPassword(req.user.id, req.body.password)

  res.status(status.noContent)
})
