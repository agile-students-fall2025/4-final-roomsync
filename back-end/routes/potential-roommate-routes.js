import express from 'express'
import PotentialRoommate from '../models/Compatibility/Potential-Roommate.js'
import passport from 'passport'

export default function potentialRoommateRoutes () {
  const requireAuth = passport.authenticate('jwt', { session: false })
  const router = express.Router()

  const handleServerError = (res, logMessage, err) => {
    console.error(logMessage, err)
    res.status(500).json({
      success: false,
      message: logMessage
    })
  }

  /**
   * Map a PotentialRoommate mongoose document into the shape
   * expected by the front-end PotentialRoommates / PotentialRoomProfile pages.
   */
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
  router.get('/potential-roommates', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const docs = await PotentialRoommate.find().sort({ createdAt: -1 }).lean()
        const mapped = docs.map(toClientShape)
        res.json(mapped)
      } catch (err) {
        handleServerError(res, 'Error fetching potential roommates', err)
      }
  })

  // GET /api/potential-roommates/:id
  router.get('/potential-roommates/:id', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
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
        handleServerError(res, 'Error fetching potential roommate', err)
      }
  })

  // POST /api/potential-roommates
  // For seeding data from curl/Postman
  router.post('/potential-roommates',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
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
        handleServerError(res, 'Error creating potential roommate', err)
      }
  })

  return router
}