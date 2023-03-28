import OrderRepository from '../repository/order.repository'
import { IOrder, IOrderService, IPaymentResult } from '../types/order'
import { text } from '../common'
import { Types } from 'mongoose'

const orderRepository = new OrderRepository()

class OrderService implements IOrderService {
  constructor() {}

  // @desc   Get order by id
  // @route  GET /order
  // @access Private
  async getOrderById(id: string) {
    if (!id) {
      throw new Error(text.res.orderIDReq)
    }

    const order = await orderRepository.findByIDAndPopulate(id, 'user', 'name email')

    if (!order) {
      throw new Error(text.res.orderNotFound)
    }
    return order
  }

  // @desc   Update order to paid
  // @route  PUT /order/pay
  // @access Private Admin
  async updateOrderToPaid(paymentObject: IPaymentResult) {
    if (!paymentObject.id) {
      throw new Error(text.res.orderIDReq)
    }

    const { id, status, update_time, email_address } = paymentObject

    const order = await orderRepository.findById(id)

    if (!order) {
      throw new Error(text.res.orderNotFound)
    }

    const updateObject = {
      isPaid: true,
      paidAt: Date.now(),
      paymentResult: {
        id,
        status,
        update_time,
        email_address,
      },
    }

    const result = await orderRepository.update(id, updateObject)
    return result
  }

  // @desc   Update order to delivered
  // @route  PUT /order/deliver
  // @access Private Editor
  async updateOrderToDelivered(id: string) {
    if (!id) {
      throw new Error(text.res.orderIDReq)
    }

    const order = orderRepository.findById(id)

    if (!order) {
      throw new Error(text.res.orderNotFound)
    }

    const updateObject = {
      isDelivered: true,
      deliveredAt: Date.now(),
    }

    const result = orderRepository.update(id, updateObject)
    return result
  }

  // @desc   Get all orders
  // @route  GET /orders
  // @access Private Editor
  async getAllOrders() {
    const orders = orderRepository.findAllAndPopulate('user', 'id name')
    return orders
  }

  // @desc   Create new order
  // @route  POST /orders
  // @access Private
  async createNewOrder(id: string, baseObject: Partial<IOrder>) {
    const { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice } = baseObject

    const orderItemsExist = [orderItems, orderItems?.length].every(Boolean)

    if (!orderItemsExist) {
      throw new Error(text.res.orderNoItems)
    }

    const newOrder = {
      user: id as unknown as Types.ObjectId,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      orderItems,
      totalPrice,
      taxPrice,
    }

    const createdOrder = await orderRepository.create(newOrder)
    return createdOrder
  }

  // @desc   Get logged in users orders
  // @route  GET /orders/myorders
  // @access Private
  async getLoggedInUserOrders(id: string) {
    const orders = await orderRepository.findAllByUserID(id)
    return orders
  }
}

export default OrderService
