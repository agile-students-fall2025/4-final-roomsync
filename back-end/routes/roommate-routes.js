// routes/roommate.js
import express from 'express'
import Roommate from '../models/Roommate.js'
import { body, validationResult } from 'express-validator'
import passport from 'passport'

const roommateRouter = () => {
  const router = express.Router()

  // Validation rules
  const roommateValidationRules = [
    body('aboutMe').trim().notEmpty().withMessage('About me is requred')
  ]

  // GET all roommates
  router.get('/roommate',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const roommates = await Roommate.find()
        res.json(roommates)
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
    }
  )

  // GET single roommate by ID
  router.get('/roommate/:id', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const roommate = await Roommate.findById(req.params.id)

        if (!roommate) {
          return res.status(404).json({ message: 'Roommate not found' })
        }

        res.json(roommate)
      } catch (error) {
        console.error('Error fetching roommate:', err)
        res.status(500).json({ success:false, message: error.message })
      }
    }
  )

  // POST create new roommate
  router.post('/roommate', 
    passport.authenticate('jwt', { session: false }),
    roommateValidationRules, 
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(400).json({ success: false, errors: errors.array() })
        }

        const { aboutMe, livingPreferences, habitsDealBreakers } = req.body

        const newRoommate = new Roommate({
          aboutMe,
          livingPreferences: livingPreferences || null,
          habitsDealBreakers: habitsDealBreakers || null
        })

        await newRoommate.save()
        res.status(201).json(newRoommate)
      } catch (err) {
        console.error('Error creating roommate:', err)
        res.status(500).json({ success: false, message: 'Server error' })
      }
    }
  )

  // PUT update roommate
  router.put('/roommate/:id', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const { aboutMe, livingPreferences, habitsDealBreakers } = req.body

        const roommate = await Roommate.findById(req.params.id)

        if (!roommate) {
          return res.status(404).json({ success: false, message: 'Roommate not found' })
        }

        if (aboutMe !== undefined) roommate.aboutMe = aboutMe
        if (livingPreferences !== undefined) roommate.livingPreferences = livingPreferences
        if (habitsDealBreakers !== undefined) roommate.habitsDealBreakers = habitsDealBreakers

        await roommate.save()
        res.json(roommate)
      } catch (err) {
        console.error('Error updating roommate:', err)
        res.status(500).json({ success: false, message: 'Server error' })
      }
    }
  )

  // DELETE roommate
  router.delete('/:id', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const roommate = await Roommate.findByIdAndDelete(req.params.id)

        if (!roommate) {
          return res.status(404).json({ success: false, message: 'Roommate not found' })
        }

        res.json({ success: true })
      } catch (err) {
        console.error('Error deleting roommate:', err)
        res.status(500).json({ success: false, message: 'Server error' })
      }
    }
  )

  return router
}

export default roommateRouter