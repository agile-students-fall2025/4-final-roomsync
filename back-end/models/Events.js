import mongoose from 'mongoose'
const Schema = mongoose.Schema

// Events Schema
const EventSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  roomId: {
    type: Number,
    required: true
  },
  createdBy: {
    type: Number,
    required: true
  },
  attendees: [{
    type: Number
  }]
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

const Event = mongoose.model('Event', EventSchema)

export default Event