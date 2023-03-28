import ProductModel from '../models/productModel'
import { IKeyword, IProduct, IProductRepository, IProductReview } from '../types/product'
import { calculateReviewRating } from '../utils/helperFns'
import { BaseRepository } from './base.repository'

class ProductRepository extends BaseRepository<IProduct> implements IProductRepository {
  constructor() {
    super(() => ProductModel)
  }

  async findAllProducts(keyword: IKeyword<string>, numberOfProductsPerPage: number, pageNumber: number) {
    return await ProductModel.find({ ...keyword })
      .limit(numberOfProductsPerPage)
      .skip(numberOfProductsPerPage * (pageNumber - 1))
      .exec()
  }

  async findTopProducts(productNumber: number) {
    return await ProductModel.find({}).sort({ rating: -1 }).limit(productNumber).exec()
  }

  async count(keyword: IKeyword<string>) {
    return await ProductModel.countDocuments({ ...keyword })
  }

  async createNewReview(id: string, review: Partial<IProductReview>) {
    const product = await this.findById(id)

    product.reviews.push(review as IProductReview)
    product.numberOfReviews = product.reviews.length

    product.rating = calculateReviewRating(product.reviews)

    return await product.save()
  }
}

export default ProductRepository
