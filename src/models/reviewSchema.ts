import mongoose, { Types } from 'mongoose'
import { EModels } from './modelRefs'

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      required: true,
      ref: EModels.User,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default reviewSchema
