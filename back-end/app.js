import express from 'express'
const app = express()
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import multer from 'multer'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config({ silent: true })
import morgan from 'morgan'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to RoomSync API" })
})

// example route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" })
})

// example POST route
app.post("/api/submit", (req, res) => {
  const { your_name, your_email, agree } = req.body

  res.json({
    status: "amazing success!",
    your_data: {
      name: your_name,
      email: your_email,
      agree: agree
    }
  })
})

const port = 3000
app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
