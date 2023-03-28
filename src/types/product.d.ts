import { IReqWithUser } from './auth.d'
import { Document, Types } from 'mongoose'
import { IUserReq } from './user'

export interface IProduct extends Document {
  _id?: Types.ObjectId
  user: Types.ObjectId
  name: string
  image: string
  brand: string
  category: string
  description: string
  reviews: [IProductReview]
  rating: number
  numberOfReviews: number
  price: number
  countInStock: number
  createdAt: NativeDate
  updatedAt: NativeDate
}

export interface IProductReview {
  _id?: Types.ObjectId
  user: Types.ObjectId
  name: string
  rating: number
  comment: string
  updatedAt: NativeDate
  createdAt: NativeDate
}

export interface IKeyword<T> {
  name?: {
    $regex: T
    $options: string
  }
}

export interface IProductRepository {
  findAllProducts: (
    keyword: IKeyword<string>,
    numberOfProductsPerPage: number,
    pageNumber: number,
  ) => Promise<IProduct[]>
  findTopProducts: (productNumber: number) => Promise<IProduct[]>
  createNewReview: (id: string, review: IProductReview) => Promise<IProduct>
}

export interface IProductService {
  getAllProducts: (
    word: string,
    pageNumber: number,
  ) => Promise<{ products: IProduct[]; pageNumber: number; pages: number }>
  getTopProducts: () => Promise<IProduct[]>
  getSingleProduct: (id: string) => Promise<IProduct>
  createNewProduct: (baseObject: IProduct) => Promise<IProduct>
  updateProduct: (updateObject: Partial<IProduct>) => Promise<IProduct>
  deleteProduct: (id: string) => Promise<string>
  createNewReview: (productId: string, rating: number, comment: string, user: IUserReq) => Promise<string>
}
