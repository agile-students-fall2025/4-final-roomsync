import express from 'express'
import Event from '../models/Events.js'
import { body, validationResult } from 'express-validator'
import passport from 'passport'

const eventRouter = () => {
  const router = express.Router()

  const eventValidationRules = [
    body('name').trim().notEmpty().withMessage('Event name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('createdBy').isInt().withMessage('CreatedBy must be a valid user ID')
  ]

  // GET all events for a specific room
  router.get('/rooms/:roomId/events', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const roomId = parseInt(req.params.roomId)
        
        // Verify user has access to this room
        if (!req.user.roomId || req.user.roomId.toString() !== roomId.toString()) {
          return res.status(403).json({ 
            success: false, 
            message: 'Access denied to this room' 
          })
        }

        const events = await Event.find({ roomId }).sort({ createdAt: -1 })
        res.json(events)
      } catch (err) {
        console.error('Error fetching events:', err)
        res.status(500).json({ success: false, message: 'Server error' })
      }
    }
  )

  // GET a specific event by id
  router.get('/rooms/:roomId/events/:id', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const roomId = parseInt(req.params.roomId)
        
        // Verify user has access to this room
        if (!req.user.roomId || req.user.roomId.toString() !== roomId.toString()) {
          return res.status(403).json({ 
            success: false, 
            message: 'Access denied to this room' 
          })
        }

        const event = await Event.findOne({ _id: req.params.id, roomId })

        if (!event) {
          return res.status(404).json({ success: false, message: 'Event not found' })
        }

        res.json(event)
      } catch (err) {
        console.error('Error fetching event:', err)
        res.status(500).json({ success: false, message: 'Server error' })
      }
    }
  )

  // GET events for a specific date
  router.get('/rooms/:roomId/events/date/:date', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const roomId = parseInt(req.params.roomId)
        const date = req.params.date
        
        // Verify user has access to this room
        if (!req.user.roomId || req.user.roomId.toString() !== roomId.toString()) {
          return res.status(403).json({ 
            success: false, 
            message: 'Access denied to this room' 
          })
        }
        
        const dayEvents = await Event.find({ roomId, date })
        res.json(dayEvents)
      } catch (err) {
        console.error('Error fetching events by date:', err)
        res.status(500).json({ success: false, message: 'Server error' })
      }
    }
  )

  // GET events for a specific month
  router.get('/rooms/:roomId/events/month/:year/:month', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const roomId = parseInt(req.params.roomId)
        const year = parseInt(req.params.year)
        const month = parseInt(req.params.month)
        
        // Verify user has access to this room
        if (!req.user.roomId || req.user.roomId.toString() !== roomId.toString()) {
          return res.status(403).json({ 
            success: false, 
            message: 'Access denied to this room' 
          })
        }
        
        const events = await Event.find({ roomId })
        
        const monthEvents = events.filter(event => {
          const eventDate = new Date(event.date)
          return eventDate.getFullYear() === year && eventDate.getMonth() === month
        })
        
        res.json(monthEvents)
      } catch (err) {
        console.error('Error fetching events by month:', err)
        res.status(500).json({ success: false, message: 'Server error' })
      }
    }
  )

  // POST new event
  router.post('/rooms/:roomId/events', 
    passport.authenticate('jwt', { session: false }),
    eventValidationRules, 
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(400).json({ success: false, errors: errors.array() })
        }

        const roomId = parseInt(req.params.roomId)
        
        // Verify user has access to this room
        if (!req.user.roomId || req.user.roomId.toString() !== roomId.toString()) {
          return res.status(403).json({ 
            success: false, 
            message: 'Access denied to this room' 
          })
        }

        const { name, location, date, time, description, createdBy } = req.body

        const newEvent = new Event({
          name,
          location,
          date,
          time,
          description: description || '',
          roomId,
          createdBy: parseInt(createdBy),
          attendees: [parseInt(createdBy)]
        })

        await newEvent.save()
        res.status(201).json(newEvent)
      } catch (err) {
        console.error('Error creating event:', err)
        res.status(500).json({ success: false, message: 'Server error' })
      }
    }
  )

  // PUT an existing event
  router.put('/rooms/:roomId/events/:id', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const roomId = parseInt(req.params.roomId)
        
        // Verify user has access to this room
        if (!req.user.roomId || req.user.roomId.toString() !== roomId.toString()) {
          return res.status(403).json({ 
            success: false, 
            message: 'Access denied to this room' 
          })
        }

        const { name, location, date, time, description } = req.body

        const event = await Event.findOne({ _id: req.params.id, roomId })

        if (!event) {
          return res.status(404).json({ success: false, message: 'Event not found' })
        }

        if (name !== undefined) event.name = name
        if (location !== undefined) event.location = location
        if (date !== undefined) event.date = date
        if (time !== undefined) event.time = time
        if (description !== undefined) event.description = description

        await event.save()
        res.json(event)
      } catch (err) {
        console.error('Error updating event:', err)
        res.status(500).json({ success: false, message: 'Server error' })
      }
    }
  )

  // POST update attendance
  router.post('/rooms/:roomId/events/:id/attendance', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const roomId = parseInt(req.params.roomId)
        
        // Verify user has access to this room
        if (!req.user.roomId || req.user.roomId.toString() !== roomId.toString()) {
          return res.status(403).json({ 
            success: false, 
            message: 'Access denied to this room' 
          })
        }

        const { userId, isAttending } = req.body

        const event = await Event.findOne({ _id: req.params.id, roomId })

        if (!event) {
          return res.status(404).json({ success: false, message: 'Event not found' })
        }

        const attendingUserId = parseInt(userId)

        if (!Array.isArray(event.attendees)) {
          event.attendees = []
        }

        const isAlreadyAttending = event.attendees.includes(attendingUserId)

        if (isAttending && !isAlreadyAttending) {
          event.attendees.push(attendingUserId)
        } else if (!isAttending && isAlreadyAttending) {
          event.attendees = event.attendees.filter(uid => uid !== attendingUserId)
        }

        await event.save()
        res.json({ success: true, event })
      } catch (err) {
        console.error('Error updating attendance:', err)
        res.status(500).json({ success: false, message: 'Server error' })
      }
    }
  )

  // DELETE event
  router.delete('/rooms/:roomId/events/:id', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const roomId = parseInt(req.params.roomId)
        
        // Verify user has access to this room
        if (!req.user.roomId || req.user.roomId.toString() !== roomId.toString()) {
          return res.status(403).json({ 
            success: false, 
            message: 'Access denied to this room' 
          })
        }

        const event = await Event.findOneAndDelete({ _id: req.params.id, roomId })

        if (!event) {
          return res.status(404).json({ success: false, message: 'Event not found' })
        }

        res.json({ success: true })
      } catch (err) {
        console.error('Error deleting event:', err)
        res.status(500).json({ success: false, message: 'Server error' })
      }
    }
  )

  return router
}

export default eventRouter