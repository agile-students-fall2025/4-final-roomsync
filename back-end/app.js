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

// ========================================
// USER MANAGEMENT
// ========================================
let users = [
  { id: 1, name: "Brian", roomId: 1 },
  { id: 2, name: "Ginny", roomId: 1 },
  { id: 3, name: "Jacob", roomId: 1 },
  { id: 4, name: "Amish", roomId: 1 },
  { id: 5, name: "Eslem", roomId: 1 },
]

// GET users for a specific room
app.get("/api/rooms/:roomId/users", (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const roomUsers = users.filter(u => u.roomId === roomId)
  res.json(roomUsers)
})

// POST new user to a room
app.post("/api/rooms/:roomId/users", (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const { name } = req.body
  const newId = Math.max(...users.map(u => u.id), 0) + 1
  const newUser = { id: newId, name: name, roomId: roomId }
  users.push(newUser)
  res.json(newUser)
})

// DELETE user from room
app.delete("/api/rooms/:roomId/users/:id", (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const id = parseInt(req.params.id)
  const index = users.findIndex(u => u.id === id && u.roomId === roomId)
  if (index !== -1) {
    users.splice(index, 1)
    res.json({ success: true })
  } else {
    res.status(404).json({ success: false, message: "User not found" })
  }
})

// POST assign user to a room
app.post("/api/users/:userId/assign-room", (req, res) => {
  const userId = parseInt(req.params.userId)
  const { roomId } = req.body
  const user = users.find(u => u.id === userId)
  if (user) {
    user.roomId = roomId
    res.json({ success: true, user })
  } else {
    res.status(404).json({ success: false, message: "User not found" })
  }
})

// ========================================
// CATEGORIES MANAGEMENT
// ========================================
let categories = [
  { id: 1, name: "Utility" },
  { id: 2, name: "Groceries" },
  { id: 3, name: "Maintenance" },
]

// GET all categories
app.get("/api/categories", (req, res) => {
  res.json(categories)
})

// POST new category
app.post("/api/categories", (req, res) => {
  const { name } = req.body
  const newId = Math.max(...categories.map(c => c.id), 0) + 1
  const newCategory = { id: newId, name: name }
  categories.push(newCategory)
  res.json(newCategory)
})

// DELETE category
app.delete("/api/categories/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const index = categories.findIndex(c => c.id === id)
  if (index !== -1) {
    categories.splice(index, 1)
    res.json({ success: true })
  } else {
    res.status(404).json({ success: false, message: "Category not found" })
  }
})

// ========================================
// PAYMENTS MANAGEMENT
// ========================================
// TODO: use real data later
let payments = [
  { id: 1, name: "Pay electricity bill", amount: 120.5, createdAt: "2025-10-20", cleared: false, categoryId: 1, paidBy: 1, owedBy: [1, 2, 3, 4, 5], roomId: 1 },
  { id: 2, name: "Refill water filter", amount: 35.0, createdAt: "2025-10-18", cleared: true, categoryId: 1, paidBy: 2, owedBy: [1, 2, 3], roomId: 1 },
  { id: 3, name: "Buy milk", amount: 4.25, createdAt: "2025-10-25", cleared: true, categoryId: 2, paidBy: 3, owedBy: [1, 3, 4], roomId: 1 },
  { id: 4, name: "Buy vegetables", amount: 18.6, createdAt: "2025-10-26", cleared: false, categoryId: 2, paidBy: 1, owedBy: [1, 2, 5], roomId: 1 },
  { id: 5, name: "Restock snacks", amount: 22.4, createdAt: "2025-10-23", cleared: false, categoryId: 2, paidBy: 4, owedBy: [1, 2, 3, 4], roomId: 1 },
  { id: 6, name: "Change air filter", amount: 15.0, createdAt: "2025-10-21", cleared: false, categoryId: 3, paidBy: 5, owedBy: [1, 2, 3, 4, 5], roomId: 1 },
  { id: 7, name: "Check smoke detector", amount: 10.0, createdAt: "2025-10-19", cleared: true, categoryId: 3, paidBy: 2, owedBy: [2, 3, 5], roomId: 1 },
]

// GET all payments for a specific room
app.get("/api/rooms/:roomId/payments", (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const roomPayments = payments.filter(p => p.roomId === roomId)
  res.json(roomPayments)
})

// GET a specific payment by id
app.get("/api/rooms/:roomId/payments/:id", (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const id = parseInt(req.params.id)
  const payment = payments.find(p => p.id === id && p.roomId === roomId)
  if (payment) {
    res.json(payment)
  } else {
    res.status(404).json({ success: false, message: "Payment not found" })
  }
})

// ========================================
//
// ========================================

export default app

const port = 3000
app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
