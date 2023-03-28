import { Document, Types } from 'mongoose'

export interface IOrderItem {
  name: string
  price: number
  qty: number
  image: string
  product: Types.ObjectId
}

export interface IShippingAddress {
  address: string
  city: string
  postalCode: string
  country: string
}

export interface IPaymentResult {
  id: string
  status: string
  update_time: string
  email_address: string
}

export interface IOrder extends Document {
  _id: Types.ObjectId
  user: Types.ObjectId
  orderItems: IOrderItem[]
  shippingAddress: IShippingAddress
  paymentMethod: string
  paymentResult: IPaymentResult
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  isPaid: boolean
  paidAt: number
  isDelivered: boolean
  deliveredAt: number
  createdAt: NativeDate
  updatedAt: NativeDate
}

export interface IOrderRepository {
  findByIDAndPopulate: (id: string, property: string, fields: string) => Promise<IOrder | null>
  findAllAndPopulate: (property: string, fields: string) => Promise<IOrder[]>
  findAllByUserID: (id: string) => Promise<IOrder[]>
}

export interface IOrderService {
  getOrderById: (id: string) => Promise<IOrder>
  updateOrderToPaid: (object: IPaymentResult) => Promise<IOrder>
  updateOrderToDelivered: (id: string) => Promise<IOrder>
  getAllOrders: () => Promise<IOrder[]>
  createNewOrder: (id: string, baseObject: Partial<IOrder>) => Promise<IOrder>
  getLoggedInUserOrders: (id: string) => Promise<IOrder[]>
}
