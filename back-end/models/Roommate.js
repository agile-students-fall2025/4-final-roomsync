// models/Roommate.js
import mongoose from 'mongoose'

const RoommateSchema = new mongoose.Schema({
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
  }
})

const Roommate = mongoose.model('Roommate', RoommateSchema)
export default Roommate