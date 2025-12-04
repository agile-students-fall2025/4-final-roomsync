import express from 'express'
import PotentialRoommate from '../models/Compatibility/Potential-Roommate.js'

export default function potentialRoommateRoutes () {
  const router = express.Router()

  const toClientShape = (doc) => ({
    id: doc._id.toString(),
    name: doc.displayName,
    budget: doc.budgetRange,
    areas: doc.locationPreference ? [doc.locationPreference] : [],
    tags: [], 
    blurb: doc.hobbiesInterests || '',
    essay: {
      about: doc.aboutMe,
      prefs: doc.livingPreferences || '',
      dealbreakers: doc.habitsDealBreakers || ''
    }
  })

  // GET /api/potential-roommates
  router.get('/potential-roommates', async (req, res) => {
    try {
      const docs = await PotentialRoommate.find().sort({ createdAt: -1 }).lean()
      const mapped = docs.map(toClientShape)
      res.json(mapped)
    } catch (err) {
      console.error('Error fetching potential roommates', err)
      res.status(500).json({
        success: false,
        message: 'Error fetching potential roommates'
      })
    }
  })

  // GET /api/potential-roommates/:id
  router.get('/potential-roommates/:id', async (req, res) => {
    try {
      const { id } = req.params
      const doc = await PotentialRoommate.findById(id).lean()

      if (!doc) {
        return res
          .status(404)
          .json({ success: false, message: 'Potential roommate not found' })
      }

      res.json(toClientShape(doc))
    } catch (err) {
      console.error('Error fetching potential roommate', err)
      res.status(500).json({
        success: false,
        message: 'Error fetching potential roommate'
      })
    }
  })

  // POST /api/potential-roommates
  // For seeding data from curl/Postman
  router.post('/potential-roommates', async (req, res) => {
    try {
      const {
        displayName,
        age,
        locationPreference,
        budgetRange,
        aboutMe,
        livingPreferences,
        habitsDealBreakers,
        hobbiesInterests,
        sleepSchedule,
        cleanlinessLevel
      } = req.body

      if (!displayName || !aboutMe) {
        return res.status(400).json({
          success: false,
          message: 'displayName and aboutMe are required'
        })
      }

      const doc = await PotentialRoommate.create({
        displayName,
        age,
        locationPreference,
        budgetRange,
        aboutMe,
        livingPreferences,
        habitsDealBreakers,
        hobbiesInterests,
        sleepSchedule,
        cleanlinessLevel
      })

      res.status(201).json(toClientShape(doc))
    } catch (err) {
      console.error('Error creating potential roommate', err)
      res.status(500).json({
        success: false,
        message: 'Error creating potential roommate'
      })
    }
  })

  return router
}