#!/usr/bin/env node

const app = require('./app')
require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env

const port = process.env.PORT || 3000

const listener = app.listen(port, function () {
  console.log(`Server running on port: ${port}`)
})

const close = () => {
  listener.close()
  // mongoose.disonnect()
  // process.exit(0)
}

module.exports = {
  app: app,
  close: close,
}