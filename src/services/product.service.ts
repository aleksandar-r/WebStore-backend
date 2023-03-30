import { IUserReq } from './../types/user.d'
import { Types } from 'mongoose'
import { text } from '../config/common'
import ProductRepository from '../repository/product.repository'
import { IProduct, IProductService } from '../types/product'

const productRepository = new ProductRepository()

class ProductService implements IProductService {
  constructor() {}

  // @desc   GET all products
  // @route  /products
  // @access Public
  async getAllProducts(word: string, pageNumber: number) {
    const numberOfProductsPerPage = 4

    const keyword = word
      ? {
          name: {
            $regex: word,
            $options: 'i',
          },
        }
      : {}

    const productCount = await productRepository.count(keyword)
    const products = await productRepository.findAllProducts(keyword, numberOfProductsPerPage, pageNumber)

    const pages = Math.ceil(productCount / numberOfProductsPerPage)

    return { products, pageNumber, pages }
  }

  // @desc   Get top rated products
  // @route  GET /products/top
  // @access Public
  async getTopProducts() {
    const productsNumber = 3

    const products = await productRepository.findTopProducts(productsNumber)
    return products
  }

  // @desc   Get a single product
  // @route  GET /products/single
  // @access Public
  async getSingleProduct(id: string) {
    if (!id) {
      throw new Error(text.res.productIDReq)
    }

    const product = await productRepository.findById(id)

    if (!product) {
      throw new Error(text.res.productNotFound)
    }

    return product
  }

  // @desc   Create a product
  // @route  POST /products/single
  // @access Private Editor
  async createNewProduct(baseObject: Partial<IProduct>) {
    const { name, price, user, image, brand, category, numberOfReviews, description } = baseObject

    const isBodyComplete = [
      numberOfReviews?.toString(),
      price?.toString(),
      description,
      category,
      brand,
      image,
      name,
      user,
    ].every(Boolean)

    if (!isBodyComplete) {
      throw new Error(text.res.allFieldsReq)
    }

    const product = await productRepository.create(baseObject)
    return product
  }

  // @desc   Update product
  // @route  PUT /products/single
  // @access Private Editor
  async updateProduct(updateObject: Partial<IProduct>) {
    const product = await productRepository.findById(updateObject.id)

    if (!product) {
      throw new Error(text.res.productNotFound)
    }

    const result = await productRepository.update(updateObject.id, updateObject)
    return result
  }

  // @desc   Delete single product
  // @route  DELETE /products/single
  // @access Private Admin
  async deleteProduct(id: string) {
    const product = await productRepository.findById(id)

    if (!product) {
      throw new Error(text.res.productNotFound)
    }

    const result = await productRepository.remove(id)
    return text.res.productRemoved
  }

  // @desc   Create a new review
  // @route  POST /products/review
  // @access Private
  async createNewReview(baseObject: { productId: string; rating: number; comment: string }, user: IUserReq) {
    const { productId, rating, comment } = baseObject
    const isBodyComplete = [productId, rating.toString(), comment].every(Boolean)

    if (!isBodyComplete) {
      throw new Error(text.res.allFieldsReq)
    }

    const product = await productRepository.findById(productId)

    if (!product) {
      throw new Error(text.res.productNotFound)
    }

    const alreadyReviewed = product.reviews.find((review) => review.user.toString() === user.id.toString())

    if (alreadyReviewed) {
      throw new Error(text.res.productReviewed)
    }

    const review = {
      user: user.id as unknown as Types.ObjectId,
      name: user.username,
      rating: Number(rating),
      comment,
    }

    await productRepository.createNewReview(user.id, review)
    return text.res.productReviewFn(product.name)
  }
}

export default ProductService
