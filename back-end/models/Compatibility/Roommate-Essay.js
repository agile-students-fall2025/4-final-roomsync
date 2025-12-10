import mongoose from 'mongoose'

const roommateEssaySchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: false,
      index: true
    },
    roomId: {
      type: Number,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    aboutMe: {
      type: String,
      required: true
    },
    idealRoommate: {
      type: String,
      default: ''
    },
    lifestyleDetails: {
      type: String,
      default: ''
    }
  },
  {
    collection: 'roommate_essays',
    timestamps: true
  }
)

const RoommateEssay = mongoose.model('RoommateEssay', roommateEssaySchema)

export default RoommateEssay