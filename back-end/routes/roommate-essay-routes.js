import express from 'express'
import RoommateEssay from '../models/Compatibility/Roommate-Essay.js'

export default function roommateEssayRoutes () {
  const router = express.Router()

  const handleServerError = (res, logMessage, err) => {
    console.error(logMessage, err)
    res.status(500).json({
      success: false,
      message: logMessage
    })
  }

  // ========================================
  // ROOMMATE ESSAYS MANAGEMENT (MongoDB)
  // ========================================

  // GET all roommate essays for a room
  router.get('/rooms/:roomId/roommate-essays', async (req, res) => {
    try {
      const roomId = parseInt(req.params.roomId, 10)
      const essays = await RoommateEssay.find({ roomId }).sort({ createdAt: -1 })
      res.json(essays)
    } catch (err) {
      handleServerError(res, 'Error fetching roommate essays', err)
    }
  })

  // GET a single essay
  router.get('/rooms/:roomId/roommate-essays/:id', async (req, res) => {
    try {
      const roomId = parseInt(req.params.roomId, 10)
      const { id } = req.params

      const essay = await RoommateEssay.findOne({ _id: id, roomId })

      if (!essay) {
        return res
          .status(404)
          .json({ success: false, message: 'Essay not found' })
      }

      res.json(essay)
    } catch (err) {
      handleServerError(res, 'Error fetching roommate essay', err)
    }
  })

  // POST create new essay
  router.post('/rooms/:roomId/roommate-essays', async (req, res) => {
    try {
      const roomId = parseInt(req.params.roomId, 10)
      const { userId, title, aboutMe, idealRoommate, lifestyleDetails } = req.body

      if (!title || !aboutMe) {
        return res.status(400).json({
          success: false,
          message: 'title and aboutMe are required'
        })
      }

      const essay = await RoommateEssay.create({
        userId: userId ? Number(userId) : null,
        roomId,
        title,
        aboutMe,
        idealRoommate: idealRoommate || '',
        lifestyleDetails: lifestyleDetails || ''
      })

      res.status(201).json(essay)
    } catch (err) {
      handleServerError(res, 'Error creating roommate essay', err)
    }
  })

  // PUT update essay
  router.put('/rooms/:roomId/roommate-essays/:id', async (req, res) => {
    try {
      const roomId = parseInt(req.params.roomId, 10)
      const { id } = req.params
      const { title, aboutMe, idealRoommate, lifestyleDetails } = req.body

      const updates = { roomId }
      if (title !== undefined) updates.title = title
      if (aboutMe !== undefined) updates.aboutMe = aboutMe
      if (idealRoommate !== undefined) updates.idealRoommate = idealRoommate
      if (lifestyleDetails !== undefined) updates.lifestyleDetails = lifestyleDetails

      const essay = await RoommateEssay.findOneAndUpdate(
        { _id: id, roomId },
        updates,
        { new: true, runValidators: true }
      )

      if (!essay) {
        return res
          .status(404)
          .json({ success: false, message: 'Essay not found' })
      }

      res.json(essay)
    } catch (err) {
      handleServerError(res, 'Error updating roommate essay', err)
    }
  })

  // DELETE essay
  router.delete('/rooms/:roomId/roommate-essays/:id', async (req, res) => {
    try {
      const roomId = parseInt(req.params.roomId, 10)
      const { id } = req.params

      const result = await RoommateEssay.findOneAndDelete({ _id: id, roomId })

      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: 'Essay not found' })
      }

      res.json({ success: true })
    } catch (err) {
      handleServerError(res, 'Error deleting roommate essay', err)
    }
  })

  return router
}
