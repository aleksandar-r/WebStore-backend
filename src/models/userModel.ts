import mongoose from 'mongoose'
import { EModels } from './modelRefs'
import auth from '../config/common/auth'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: [auth.role.user],
  },
  active: {
    type: Boolean,
    default: true,
  },
})

const UserModel = mongoose.model(EModels.User, userSchema)

export default UserModel
