import mongoose from 'mongoose'
const Schema = mongoose.Schema

// Chore schema
const ChoreSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: Number,
    required: true,
  },
  finished: {
    type: Boolean,
    default: false,
  },
  roomId: {
    type: Number,
    required: true,
  },
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

const Chore = mongoose.model('Chore', ChoreSchema)

export default Chore
