import mongoose from 'mongoose'
import Apartment from './models/Compatibility/Apartment.js'
import dotenv from 'dotenv'

dotenv.config()

// Your mock data converted to Apartment model format
const mockApartments = [
  {
    listingTitle: 'TheBestBuilding',
    location: '123 3rd Ave, New York',
    monthlyRent: 1600,
    deposit: null,
    startDate: new Date('2025-12-01'),
    endDate: null,
    isPrivate: true,
    amenities: ['furnished', 'elevator'],
    houseRules: 'no smoking',
    idealRoommate: 'Works hybrid, cooks often, likes clean common areas. ',
    images: []
  },
  {
    listingTitle: 'TheGreatestBuilding',
    location: '456 Metropolitan Ave, Brooklyn',
    monthlyRent: 3000,
    deposit: null,
    startDate: new Date('2025-12-01'),
    endDate: null,
    isPrivate: false,
    amenities: ['elevator', 'furnished', 'doorman'],
    houseRules: 'no shoes indoor',
    idealRoommate: 'Quiet hours 11pm–7am. Dealbreakers: Pets with severe shedding.',
    images: []
  },
  {
    listingTitle: 'CozyEastVillageStudio',
    location: '789 Ave A, New York',
    monthlyRent: 1800,
    deposit: 1800,
    startDate: new Date('2026-01-01'),
    endDate: null,
    isPrivate: true,
    amenities: ['pet-friendly', 'in-unit-laundry', 'air-conditioning'],
    houseRules: ' Keep common areas tidy.',
    idealRoommate: 'Dog lover',
    images: []
  },
  {
    listingTitle: 'Williamsburg Loft',
    location: '321 Bedford Ave, Brooklyn',
    monthlyRent: 2200,
    deposit: 2200,
    startDate: new Date('2025-12-15'),
    endDate: new Date('2026-12-15'),
    isPrivate: false,
    amenities: ['furnished', 'air-conditioning', 'gym'],
    houseRules: 'No smoking. ',
    idealRoommate: ' Chill vibe, occasional dinner parties.',
    images: []
  }
]

async function seedApartments() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing apartments
    await Apartment.deleteMany({})
    console.log('🗑️  Cleared existing apartments')

    // Insert mock apartments
    const apartments = await Apartment.insertMany(mockApartments)
    console.log(`✅ Successfully seeded ${apartments.length} apartments:`)
    apartments.forEach(apt => {
      console.log(`   - ${apt.listingTitle} at ${apt.location}`)
    })

    console.log('\n🎉 Seeding complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding apartments:', error)
    process.exit(1)
  }
}

seedApartments()
