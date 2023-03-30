import { IReqWithUser } from './../types/auth.d'
import { Request, Response, Router } from 'express'
import AuthenticationMiddleware from '../middleware/authenticate'
import AuthorizationMiddleware from '../middleware/authorize'
import OrderService from '../services/order.service'

export const orderRoute = Router()
const orderService = new OrderService()
const authorize = new AuthorizationMiddleware()
const authentication = new AuthenticationMiddleware()

orderRoute.use(authentication.verifyJWT)

// getAllOrders
orderRoute.get('/', authorize.isEditor, async (req: Request, res: Response) => {
  const orders = await orderService.getAllOrders()

  res.json(orders)
})

// getOrderByID
orderRoute.get('/single', authorize.isAdmin, async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(req.body.id)

  res.json(order)
})

// getLoggedInUsersOrders
orderRoute.get('/myorders', async (req: IReqWithUser, res: Response) => {
  const usersOrders = await orderService.getLoggedInUserOrders(req.user.id)

  res.json(usersOrders)
})

// createNewOrder
orderRoute.post('/', async (req: IReqWithUser, res: Response) => {
  const order = await orderService.createNewOrder(req.user.id, req.body)

  res.json(order)
})

// updateOrderToPaid
orderRoute.put('/pay', async (req: IReqWithUser, res: Response) => {
  const orderPaid = await orderService.updateOrderToPaid(req.body)

  res.json(orderPaid)
})

// updateOrderToDelivered
orderRoute.put('/deliver', async (req: IReqWithUser, res: Response) => {
  const orderDelivered = orderService.updateOrderToDelivered(req.user.id)

  res.json(orderDelivered)
})

export default orderRoute
