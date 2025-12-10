import express from 'express'
import Apartment from '../models/Compatibility/Apartment.js'
import passport from'passport'
import mongoose from 'mongoose'

export default function apartmentRoutes () {
  const router = express.Router()

  // ========================================
  // APARTMENT (AVAILABLE SPACE) MANAGEMENT
  // Base path will be `/api` in app.js, so
  // full routes look like `/api/apartments/*`
  // ========================================

  // GET /api/apartments
  // Return all apartment records (newest first)
  router.get('/apartments',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const apartments = await Apartment.find().sort({ createdAt: -1 })
        res.json(apartments)
      } catch (err) {
        console.error('Error fetching apartments', err)
        res.status(500).json({
          success: false,
          message: 'Error fetching apartments'
        })
      }
    }
  )

  // GET /api/apartments/:id
  // Return a single apartment by id
  router.get('/apartments/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const { id } = req.params
        const apartment = await Apartment.findById(id)

        if (!apartment) {
          return res
            .status(404)
            .json({ success: false, message: 'Apartment not found' })
        }

        res.json(apartment)
      } catch (err) {
        console.error('Error fetching apartment', err)
        res.status(500).json({
          success: false,
          message: 'Error fetching apartment'
        })
      }
    }
  )

  // POST /api/apartments
  // Create a new apartment document
  router.post('/apartments', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const apartment = new Apartment({
          ...req.body,
          createdBy: req.user.id
        })
        await apartment.save()
        res.status(201).json(apartment)
      } catch (err) {
        console.error('Error creating apartment', err)
        res.status(500).json({
          success: false,
          message: 'Error creating apartment'
        })
      }
    }
  )

  // PUT /api/apartments/:id
  // Update an existing apartment document
  router.put('/apartments/:id', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const { id } = req.params

        const apartment = await Apartment.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true
        })

        if (!apartment) {
          return res
            .status(404)
            .json({ success: false, message: 'Apartment not found' })
        }

        res.json(apartment)
      } catch (err) {
        console.error('Error updating apartment', err)
        res.status(500).json({
          success: false,
          message: 'Error updating apartment'
        })
      }
    }
  )

  // DELETE /api/apartments/:id
  // Remove an apartment document
  router.delete('/apartments/:id', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const { id } = req.params

        const result = await Apartment.findByIdAndDelete(id)

        if (!result) {
          return res
            .status(404)
            .json({ success: false, message: 'Apartment not found' })
        }

        res.json({ success: true })
      } catch (err) {
        console.error('Error deleting apartment', err)
        res.status(500).json({
          success: false,
          message: 'Error deleting apartment'
        })
      }
    }
  )

  return router
}