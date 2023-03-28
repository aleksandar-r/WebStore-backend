import jwt from 'jsonwebtoken'
import { User as FoundUser } from '../types/auth'
import { ProductReview } from '../types/product'
import User from '../models/userModel'
import auth from '../common/auth'

export const calculateReviewRating = (reviews: ProductReview[] | undefined) => {
  if (!reviews) return 0

  const sumReviews = reviews.reduce((acc: number, item: ProductReview) => item.rating + acc, 0)
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

export const createTokens = (user: FoundUser) => {
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
