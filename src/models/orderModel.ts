import Inc from 'mongoose-sequence'
import mongoose from 'mongoose'
import { IOrder } from '../types/order'
import { EModels } from './modelRefs'

// @ts-ignore
const AutoIncrement = Inc(mongoose)

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: EModels.User,
    },
    orderItems: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: EModels.Product },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Number,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
)

// @ts-ignore
orderSchema.plugin(AutoIncrement, { id: 'order_id', inc_field: 'id' })

const OrderModel = mongoose.model<IOrder>(EModels.Order, orderSchema)

export default OrderModel
