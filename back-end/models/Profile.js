import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  about: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  community: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    }
  }
})

const Profile = mongoose.model('Profile', ProfileSchema)

export default Profile