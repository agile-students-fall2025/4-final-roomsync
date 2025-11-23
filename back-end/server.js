#!/usr/bin/env node

import app from './app.js'
import dotenv from 'dotenv'
dotenv.config({ silent: true }) // load environmental variables from a hidden file named .env

const port = process.env.PORT || 3000

const listener = app.listen(port, function () {
  console.log(`Server running on port: ${port}`)
})

const close = () => {
  listener.close()
  // mongoose.disconnect()
  // process.exit(0)
}

export { app, close }