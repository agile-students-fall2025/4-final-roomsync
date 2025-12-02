// routes/room-routes.js - CORRECTED VERSION
import express from 'express'
import passport from 'passport'
import mongoose from 'mongoose'
import Room from '../models/Room.js'
import User from '../models/User.js'

const roomRoutes = () => {
  const router = express.Router()

  // POST invite users to room
  router.post('/invite',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const { emails} = req.body

        if (!emails || emails.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Please provide at least one email to invite'
          })
        }
        

        // Check if user has a room
        if (!req.user.roomId) {
          console.log("in the if")
          const room = new Room({
            createdBy: req.user._id,
            members: [req.user._id]
          })
          
          await room.save()

          req.user.roomId = room._id
          await req.user.save()
        }

        const room = await Room.findById(req.user.roomId)
        
        if (!room) {
          return res.status(404).json({
            success: false,
            message: 'Room not found'
          })
        }

        const results = []
        const errors = []

        for (const email of emails) {
          try {
            // Find user by email
            const userToInvite = await User.findOne({ email })
            
            if (!userToInvite) {
              errors.push(`${email}: User not registered`)
              continue
            }

            // User already has a room
            if (userToInvite.roomId) {
              errors.push(`${email}: Already belongs to another household`)
              continue
            }

            // User is already in this room
            if (room.members.some(memberId => memberId.equals(userToInvite._id))) {
              errors.push(`${email}: Already in this room`)
              continue
            }

            // Add user to room members
            room.members.push(userToInvite._id)
            
            // Update user's roomId
            userToInvite.roomId = room._id
            await userToInvite.save()

            results.push(`${email}: Invited successfully`)
          } catch (err) {
            errors.push(`${email}: Error - ${err.message}`)
          }
        }

        await room.save()

        res.json({
          success: true,
          message: 'Invitation process completed',
          results,
          errors: errors.length > 0 ? errors : undefined
        })
      } catch (error) {
        console.error('Invite error:', error)
        res.status(500).json({
          success: false,
          message: 'Error processing invitations'
        })
      }
    }
  )

  // Get room info
  router.get('/my-room',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        if (!req.user.roomId) {
          return res.json({
            success: true,
            hasRoom: false,
            message: 'You are not in any room yet'
          })
        }

        const room = await Room.findById(req.user.roomId)
          .populate('members', 'username email')
          .populate('createdBy', 'username email')

        if (!room) {
          return res.status(404).json({
            success: false,
            message: 'Room not found'
          })
        }

        res.json({
          success: true,
          hasRoom: true,
          room
        })
      } catch (error) {
        console.error('Get room error:', error)
        res.status(500).json({
          success: false,
          message: 'Error fetching room info'
        })
      }
    }
  )

  // GET all users in current room (protected)
  router.get('/members',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        if (!req.user.roomId) {
          return res.json({
            success: true,
            members: []
          })
        }

        const users = await User.find({ roomId: req.user.roomId })
          .select('username email _id')

        res.json({
          success: true,
          members: users
        })
      } catch (error) {
        console.error('Get members error:', error)
        res.status(500).json({
          success: false,
          message: 'Error fetching room members'
        })
      }
    }
  )

  // GET users by room ID (optional, for backward compatibility)
  router.get('/:roomId/users',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const { roomId } = req.params
        
        // Verify the user has access to this room
        if (!req.user.roomId || req.user.roomId.toString() !== roomId) {
          return res.status(403).json({
            success: false,
            message: 'Access denied'
          })
        }

        const users = await User.find({ roomId })
          .select('username email _id')

        res.json(users) // Return array directly for compatibility
      } catch (error) {
        console.error('Get users by room error:', error)
        res.status(500).json({
          success: false,
          message: 'Error fetching room users'
        })
      }
    }
  )

  
  router.post('/leave',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      if (!req.user.roomId) {
        return res.status(400).json({
          success: false,
          message: 'You are not in any room'
        })
      }

      const room = await Room.findById(req.user.roomId)
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        })
      }

      // Remove user from room members
      room.members = room.members.filter(memberId => 
        !memberId.equals(req.user._id)
      )

      // If room becomes empty, delete it
      if (room.members.length === 0) {
        await Room.deleteOne({ _id: room._id })
      } else {
        await room.save()
      }

      // Update user's roomId
      req.user.roomId = null
      await req.user.save()

      res.json({
        success: true,
        message: 'Successfully left the household'
      })
    } catch (error) {
      console.error('Leave room error:', error)
      res.status(500).json({
        success: false,
        message: 'Error leaving room'
      })
    }
  }
)

// Delete entire room (only room creator can do this)
router.delete('/delete',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      if (!req.user.roomId) {
        return res.status(400).json({
          success: false,
          message: 'You are not in any room'
        })
      }

      const room = await Room.findById(req.user.roomId)
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        })
      }

      // Check if user is the room creator
      if (!room.createdBy.equals(req.user._id)) {
        return res.status(403).json({
          success: false,
          message: 'Only the household creator can delete it'
        })
      }

      // Get all members to update
      const members = await User.find({ roomId: room._id })
      
      // Remove roomId from all members
      await User.updateMany(
        { roomId: room._id },
        { $set: { roomId: null } }
      )

      // Delete the room
      await Room.deleteOne({ _id: room._id })

      res.json({
        success: true,
        message: 'Household deleted successfully. All members have been removed.',
        affectedMembers: members.length
      })
    } catch (error) {
      console.error('Delete room error:', error)
      res.status(500).json({
        success: false,
        message: 'Error deleting room'
      })
    }
  }
)

  return router
}

export default roomRoutes