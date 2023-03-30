import jwt from 'jsonwebtoken'
import { IUser } from '../types/auth'
import { IProductReview } from '../types/product'
import User from '../models/userModel'
import auth from '../config/common/auth'

export const calculateReviewRating = (reviews: IProductReview[] | undefined) => {
  if (!reviews) return 0

  const sumReviews = reviews.reduce((acc: number, item: IProductReview) => item.rating + acc, 0)
  return sumReviews / reviews?.length
}

export const getUser = async (id: string) => {
  if (!id) return false

  const user = await User.findById(id)
    .select('-password')
    .exec()
    .catch((error) => console.error(error))

  if (!user) return false
  return user
}

export const createTokens = (user: IUser)  => {
  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: user?._id,
        username: user?.username,
        roles: user?.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: auth.accessTokenExpiry },
  )

  const refreshToken = jwt.sign({ username: user?.username }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: auth.refreshTokenExpiry,
  })

  return { accessToken, refreshToken }
}
