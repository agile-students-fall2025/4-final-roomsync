import mongoose from 'mongoose'
const Schema = mongoose.Schema


const ApartmentSchema = new Schema({
  listingTitle: {
    type: String,
    required: false,
    default: null,
  },
  location: {
    type: String,
    required: true,
  },
  monthlyRent: {
    type: Number,
    required: true,
  },
  deposit: {
    type: Number,
    required: false,
    default: null,
  },
  startDate: {
    type: Date,
    required: false,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: false,
    default: null,
  },
  isPrivate: {
    type: Boolean,
    required: true,
  },
  amenities: {
    type: [String],
    enum: ['pet-friendly', 'in-unit-laundry', 'air-conditioning', 'gym', 'elevator', 'furnished', 'doorman'],
    required: false,
    default: [],
  },
  houseRules: {
    type: String,
    required: false,
    default: null,
  },
  idealRoommate: {
    type: String,
    required: false,
    default: null,
  },
  images: {
    type: [String],
    required: false,
    default: [],
    validate: {
      validator: function(v) {
        return v.length <= 10;  // Max 10 images
      },
      message: 'No more than 10 images'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
})

const Apartment = mongoose.model('Apartment', ApartmentSchema)

export default Apartment