// Chore routes - handles CRUD operations for chores within rooms
// This module provides REST API endpoints for managing chores assigned to room members
import express from 'express'
import passport from 'passport'
import Chore from '../models/Chore.js'

// this is a router where all chores are handled
const choreRouter = () => {
  const router = express.Router()

  // GET all chores for a specific room
  // Returns chores sorted by creation date (newest first)
  router.get('/rooms/:roomId/chores',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        // Parse roomId from URL parameter to ensure it's an integer
        const roomId = parseInt(req.params.roomId)

        // Verify user has access to this room
        if (!req.user.roomId || req.user.roomId.toString() !== roomId.toString()) {
          return res.status(403).json({
            success: false,
            message: 'Access denied to this room'
          })
        }

        // Query database for all chores belonging to this room, sorted by newest first
        const chores = await Chore.find({ roomId }).sort({ createdAt: -1 })
        res.json(chores)
      } catch (err) {
        console.error('Error fetching chores:', err)
        res.status(500).json({ success: false, message: 'Server error' })
      }
    }
  )

  // GET a specific chore by id
  router.get('/rooms/:roomId/chores/:id',
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

        const chore = await Chore.findOne({ _id: req.params.id, roomId })

        if (!chore) {
          return res.status(404).json({ success: false, message: 'Chore not found' })
        }

        res.json(chore)
      } catch (err) {
        console.error('Error fetching chore:', err)
        res.status(500).json({ success: false, message: 'Server error' })
      }
    }
  )

  // POST new chore to a room
  router.post('/rooms/:roomId/chores',
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

        const { name, assignedTo } = req.body

        if (!name || !assignedTo) {
          return res.status(400).json({ success: false, message: 'Name and assignedTo are required' })
        }

        const newChore = new Chore({
          name,
          assignedTo: parseInt(assignedTo),
          finished: false,
          roomId
        })

        await newChore.save()
        res.status(201).json(newChore)
      } catch (err) {
        // when request fails
        console.error('Error creating chore:', err)
        res.status(500).json({ success: false, message: 'Server error' })
      }
    }
  )

  // PUT (update) an existing chore
  router.put('/rooms/:roomId/chores/:id',
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

        const { name, assignedTo, finished } = req.body

        const chore = await Chore.findOne({ _id: req.params.id, roomId })

        if (!chore) {
          return res.status(404).json({ success: false, message: 'Chore not found' })
        }

        if (name !== undefined) chore.name = name
        if (assignedTo !== undefined) chore.assignedTo = parseInt(assignedTo)
        if (finished !== undefined) chore.finished = Boolean(finished)

        await chore.save()
        res.json(chore)
      } catch (err) {
        // when request fails
        console.error('Error updating chore:', err)
        res.status(500).json({ success: false, message: 'Server error' })
      }
    }
  )

  // DELETE chore from room
  router.delete('/rooms/:roomId/chores/:id',
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

        const chore = await Chore.findOneAndDelete({ _id: req.params.id, roomId })

        if (!chore) {
          return res.status(404).json({ success: false, message: 'Chore not found' })
        }

        res.json({ success: true })
      } catch (err) {
        // when request fails
        console.error('Error deleting chore:', err)
        res.status(500).json({ success: false, message: 'Server error' })
      }
    }
  )

  return router
}

export default choreRouter
