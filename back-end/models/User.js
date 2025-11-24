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
  }
})

const User = mongoose.model('User', UserSchema)

export default User