import dotenv from 'dotenv'
dotenv.config({ silent: true })

import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId
import User from '../models/User.js'

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

// set up some JWT authentication options for passport
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}
// console.log(jwtOptions) // debug to make sure the secret from the .env file is loaded correctly

const jwtVerifyToken = async function (jwt_payload, next) {
  console.log('JWT payload received', jwt_payload) // debugging

  // check if the token has expired
  const expirationDate = new Date(jwt_payload.exp * 1000) // convert from seconds to milliseconds
  if (expirationDate < new Date()) {
    return next(null, false, { message: 'JWT token has expired.' })
  }

  try {
    // find this user in the database
    const userId = new ObjectId(jwt_payload.id) // convert the string id to an ObjectId
    const user = await User.findOne({ _id: userId }).exec()
    if (user) {
      next(null, user)
    } else {
      // we didn't find the user... fail!
      next(null, false, { message: 'User not found' })
    }
  } catch (error) {
    console.error('Error finding user:', error)
    next(error, false)
  }
}

// Create and export the strategy
const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerifyToken)

export default jwtStrategy