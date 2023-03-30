import { Request, Response, Router } from 'express'
import AuthenticationMiddleware from '../middleware/authenticate'
import AuthorizationMiddleware from '../middleware/authorize'
import ProductService from '../services/product.service'
import { IReqWithUser } from '../types/auth'

export const productRoute = Router()
const productService = new ProductService()
const authorize = new AuthorizationMiddleware()
const authentication = new AuthenticationMiddleware()

// getAllProducts
productRoute.get('/all', async (req: Request, res: Response) => {
  const pageNumber = Number(req.query.pageNumber) || 1
  const keyword = req.query.keyword?.toString() ?? ''

  const result = await productService.getAllProducts(keyword, pageNumber)

  res.json(result)
})

// getTopProducts
productRoute.get('/top', async (req: Request, res: Response) => {
  const products = await productService.getTopProducts()

  res.json(products)
})

// getSingleProduct
productRoute.get('/', async (req: Request, res: Response) => {
  const product = await productService.getSingleProduct(req.body.id)

  res.json(product)
})

productRoute.use(authentication.verifyJWT)

// createProduct
productRoute.post('/', authorize.isEditor, async (req: Request, res: Response) => {
  const createdProduct = await productService.createNewProduct(req.body)

  res.json(createdProduct)
})

// updateProduct
productRoute.put('/', authorize.isEditor, async (req: Request, res: Response) => {
  const updatedObject = await productService.updateProduct(req.body)

  res.json(updatedObject)
})

// deleteProduct
productRoute.delete('/', authorize.isAdmin, async (req: Request, res: Response) => {
  const deletedProductConfirmation = await productService.deleteProduct(req.body.id)

  res.json({ message: deletedProductConfirmation })
})

// createReview
productRoute.post('/review', async (req: IReqWithUser, res: Response) => {
  const createdReviewConfirmation = await productService.createNewReview(req.body, req.user)

  res.json({ message: createdReviewConfirmation })
})

export default productRoute
