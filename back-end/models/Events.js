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
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString()
      ret.createdBy = ret.createdBy.toString()
      ret.roomId = ret.roomId.toString()
      ret.attendees = ret.attendees.map(a => a.toString())
      delete ret._id
      delete ret.__v
      return ret
    }
  }
})

const Event = mongoose.model('Event', EventSchema)

export default Event