import mongoose from 'mongoose'

const roommateEssaySchema = new mongoose.Schema(
  {
    userId: { type: Number, required: false },
    roomId: { type: Number, required: true },
    title: { type: String, required: true },
    aboutMe: { type: String, required: true },
    idealRoommate: { type: String, default: '' },
    lifestyleDetails: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: 'roommate_essays' }
)

const RoommateEssay = mongoose.model('RoommateEssay', roommateEssaySchema)

export default RoommateEssay