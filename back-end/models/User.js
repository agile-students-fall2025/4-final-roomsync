import mongoose from 'mongoose'
const Schema = mongoose.Schema


const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roomId: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null,
  }
}, {
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id
      ret.name = ret.username
      delete ret.password
      delete ret.__v
      return ret
    }
  }
})

const User = mongoose.model('User', UserSchema)

export default User