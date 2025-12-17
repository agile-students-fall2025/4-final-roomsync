import express from 'express'
import Apartment from '../models/Compatibility/Apartment.js'
import passport from'passport'
import mongoose from 'mongoose'

export default function apartmentRoutes () {
  const requireAuth = passport.authenticate('jwt', { session: false })
  const router = express.Router()
  
  // GET /api/apartments/search
  // Search apartments with filters
  router.get('/apartments/search',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const {
        location,
        minPrice,
        maxPrice,
        startDate,
        endDate,
        roomType,
        amenities
      } = req.query

      let query = {}

      // Location filter (case-insensitive partial match)
      if (location) {
        query.location = { $regex: location, $options: 'i' }
      }

      // Price range filter
      if (minPrice || maxPrice) {
        query.monthlyRent = {}
        if (minPrice) query.monthlyRent.$gte = Number(minPrice)
        if (maxPrice) query.monthlyRent.$lte = Number(maxPrice)
      }

      // Room type filter
      if (roomType) {
        query.isPrivate = roomType === 'Private'
      }

      // Amenities filter
      if (amenities) {
        const amenitiesArray = Array.isArray(amenities) 
          ? amenities 
          : [amenities]
        
        if (amenitiesArray.length > 0) {
          query.amenities = { $all: amenitiesArray }
        }
      }

      const apartments = await Apartment.find(query).sort({ createdAt: -1 })

      console.log(`Found ${apartments.length} matching apartments`)

      res.json({
        success: true,
        count: apartments.length,
        apartments: apartments
      })

    } catch (err) {
      console.error('Error searching apartments:', err)
      res.status(500).json({
        success: false,
        message: 'Error searching apartments',
        error: err.message
      })
    }
  }
)

  // GET /api/apartments
  // Return all apartment records (newest first)
  router.get(
    '/apartments',
    requireAuth,
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
  router.get(
    '/apartments/:id',
    requireAuth,
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
  router.post(
    '/apartments',
    requireAuth,
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
  router.put(
    '/apartments/:id',
    requireAuth,
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
  router.delete(
    '/apartments/:id',
    requireAuth,
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