import mongoose from 'mongoose'

const { Schema } = mongoose
const PotentialRoommateSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null
    },

    displayName: {
      type: String,
      required: true
    },

    age: {
      type: Number,
      required: false,
      default: null
    },

    locationPreference: {
      type: String,
      required: false,
      default: null // e.g., "Downtown Brooklyn", "Near campus"
    },

    budgetRange: {
      type: String,
      required: false,
      default: null // e.g., "$1200–$1600"
    },

    aboutMe: {
      type: String,
      required: true
    },

    livingPreferences: {
      type: String,
      required: false,
      default: null
    },

    habitsDealBreakers: {
      type: String,
      required: false,
      default: null
    },

    hobbiesInterests: {
      type: String,
      required: false,
      default: null
    },

    sleepSchedule: {
      type: String,
      required: false,
      default: null // e.g., "early bird", "night owl"
    },

    cleanlinessLevel: {
      type: String,
      required: false,
      default: null // e.g., "super tidy", "pretty relaxed"
    }
  },
  {
    timestamps: true
  }
)

const PotentialRoommate = mongoose.model(
  'PotentialRoommate',
  PotentialRoommateSchema
)

export default PotentialRoommate
