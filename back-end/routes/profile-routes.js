import express from 'express'
import passport from 'passport'
import Profile from '../models/Profile.js'
import { body, validationResult } from 'express-validator'

const profileRouter = () => {
  const router = express.Router()

  // Validation rules
  const profileValidationRules = [
    body('about').optional().trim().isLength({ max: 1000 }).withMessage('About section cannot exceed 1000 characters'),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
    body('skills.*').optional().trim().isLength({ max: 50 }).withMessage('Each skill cannot exceed 50 characters'),
    body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
    body('community').optional().trim().isLength({ max: 100 }).withMessage('Community cannot exceed 100 characters')
  ]

  // GET profile by userId (protected route)
  router.get('/users/:userId/profile',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const requestedUserId = req.params.userId
        
        // Verify user is requesting their own profile or is authorized
        if (req.user._id.toString() !== requestedUserId) {
          return res.status(403).json({ 
            success: false, 
            message: 'Not authorized to view this profile' 
          })
        }

        const profile = await Profile.findOne({ userId: requestedUserId })
        
        if (!profile) {
          return res.status(404).json({ 
            success: false, 
            message: 'Profile not found' 
          })
        }
        
        res.json(profile)
      } catch (err) {
        console.error('Error fetching profile:', err)
        res.status(500).json({ 
          success: false, 
          message: 'Server error fetching profile' 
        })
      }
    }
  )

  // POST create new profile (protected route)
  router.post('/users/:userId/profile',
    passport.authenticate('jwt', { session: false }),
    profileValidationRules,
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(400).json({ 
            success: false, 
            errors: errors.array() 
          })
        }

        const userId = req.params.userId
        
        // Verify user is creating their own profile
        if (req.user._id.toString() !== userId) {
          return res.status(403).json({ 
            success: false, 
            message: 'Not authorized to create this profile' 
          })
        }

        // Check if profile already exists
        const existingProfile = await Profile.findOne({ userId })
        if (existingProfile) {
          return res.status(400).json({ 
            success: false, 
            message: 'Profile already exists' 
          })
        }

        const { about, skills, isPublic, profilePicture, community } = req.body

        const newProfile = new Profile({
          userId,
          about: about || '',
          skills: Array.isArray(skills) ? skills : [],
          isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
          profilePicture: profilePicture || null,
          community: community || ''
        })

        await newProfile.save()
        res.status(201).json(newProfile)
      } catch (err) {
        console.error('Error creating profile:', err)
        res.status(500).json({ 
          success: false, 
          message: 'Server error creating profile' 
        })
      }
    }
  )

  // PUT update profile (protected route)
  router.put('/users/:userId/profile',
    passport.authenticate('jwt', { session: false }),
    profileValidationRules,
    async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(400).json({ 
            success: false, 
            errors: errors.array() 
          })
        }

        const userId = req.params.userId
        
        // Verify user is updating their own profile
        if (req.user._id.toString() !== userId) {
          return res.status(403).json({ 
            success: false, 
            message: 'Not authorized to update this profile' 
          })
        }

        const profile = await Profile.findOne({ userId })
        
        if (!profile) {
          return res.status(404).json({ 
            success: false, 
            message: 'Profile not found' 
          })
        }

        const { about, skills, isPublic, profilePicture, community } = req.body

        if (about !== undefined) profile.about = about
        if (skills !== undefined) profile.skills = Array.isArray(skills) ? skills : []
        if (isPublic !== undefined) profile.isPublic = Boolean(isPublic)
        if (profilePicture !== undefined) profile.profilePicture = profilePicture
        if (community !== undefined) profile.community = community

        await profile.save()
        res.json(profile)
      } catch (err) {
        console.error('Error updating profile:', err)
        res.status(500).json({ 
          success: false, 
          message: 'Server error updating profile' 
        })
      }
    }
  )

  // DELETE profile (protected route)
  router.delete('/users/:userId/profile',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const userId = req.params.userId
        
        // Verify user is deleting their own profile
        if (req.user._id.toString() !== userId) {
          return res.status(403).json({ 
            success: false, 
            message: 'Not authorized to delete this profile' 
          })
        }

        const profile = await Profile.findOneAndDelete({ userId })
        
        if (!profile) {
          return res.status(404).json({ 
            success: false, 
            message: 'Profile not found' 
          })
        }
        
        res.json({ success: true })
      } catch (err) {
        console.error('Error deleting profile:', err)
        res.status(500).json({ 
          success: false, 
          message: 'Server error deleting profile' 
        })
      }
    }
  )

  return router
}

export default profileRouter