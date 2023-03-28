import OrderModel from '../models/orderModel'
import { IOrder, IOrderRepository } from '../types/order'
import { BaseRepository } from './base.repository'

class OrderRepository extends BaseRepository<IOrder> implements IOrderRepository {
  constructor() {
    super(() => OrderModel)
  }

  async findByIDAndPopulate(id: string, property: string, fields: string) {
    return await OrderModel.findById(id).populate(property, fields).exec()
  }

  async findAllAndPopulate(property: string, fields: string) {
    return OrderModel.find().populate(property, fields)
  }

  async findAllByUserID(id: string) {
    return OrderModel.find({ user: id })
  }
}

export default OrderRepository
