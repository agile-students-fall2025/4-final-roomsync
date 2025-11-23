import express from 'express'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import User from '../models/User.js'

// a method that contains code to handle authentication-specific routes
const authenticationRouter = () => {
  // create a new router that we can customize
  const router = express.Router()

  // a route to handle user registration requests to /auth/register
  router.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body

      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username, email, and password are required'
        })
      }

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email or username already exists'
        })
      }

      // Create new user (no hashing for now)
      const newUser = new User({
        username,
        email,
        password // storing plain text for now
      })

      await newUser.save()

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          roomId: newUser.roomId
        }
      })
    } catch (err) {
      console.error('Registration error:', err)
      res.status(500).json({
        success: false,
        message: 'Server error during registration'
      })
    }
  })

  // a route to handle login attempts requested to /auth/login
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        })
      }

      // Find user in database
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
      }

      // Check password (plain text for now, no bcrypt)
      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          roomId: user.roomId
        }
      })
    } catch (err) {
      console.error('Login error:', err)
      res.status(500).json({
        success: false,
        message: 'Server error during login'
      })
    }
  })

  // a route to handle logging out requests to /auth/logout
  router.get('/logout', function (req, res) {
    // nothing really to do here... logging out with JWT authentication is handled entirely by the front-end by deleting the token from the browser's memory
    res.json({
      success: true,
      message:
        "There is actually nothing to do on the server side... you simply need to delete your token from the browser's local storage!",
    })
    return
  })

  // a route to get current user info (protected) /auth/me
  router.get('/me',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        // req.user is set by passport JWT strategy
        const user = await User.findById(req.user._id).select('-password')

        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          })
        }

        res.json({
          success: true,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            roomId: user.roomId
          }
        })
      } catch (err) {
        console.error('Error fetching user:', err)
        res.status(500).json({
          success: false,
          message: 'Server error'
        })
      }
    }
  )

  return router
}

// export the router
export default authenticationRouter
