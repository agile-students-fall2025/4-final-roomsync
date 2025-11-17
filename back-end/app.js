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
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to RoomSync API' })
})

// example route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// example POST route
app.post('/api/submit', (req, res) => {
  const { your_name, your_email, agree } = req.body

  res.json({
    status: 'amazing success!',
    your_data: {
      name: your_name,
      email: your_email,
      agree: agree,
    },
  })
})

// ========================================
// USER MANAGEMENT
// ========================================
let users = [
  { id: 1, email: "brian@agile.com", name: "Brian", password: "123456", roomId: 1 },
  { id: 2, email: "ginny@agile.com", name: "Ginny", password: "789101", roomId: 1 },
  { id: 3, email: "jacob@agile.com", name: "Jacob", password: "213141", roomId: 1 },
  { id: 4, email: "amish@agile.com", name: "Amish", password: "516171", roomId: 1 },
  { id: 5, email: "eslem@agile.com", name: "Eslem", password: "819202", roomId: 1 },
]

// GET users for a specific room
app.get('/api/rooms/:roomId/users', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const roomUsers = users.filter(u => u.roomId === roomId)
  res.json(roomUsers)
})


// POST new user to a room
app.post("/api/rooms/:roomId/users", (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const { name , email } = req.body
  const newId = Math.max(...users.map(u => u.id), 0) + 1
  const newUser = { id: newId, name: name, email: email, roomId: roomId }
  users.push(newUser)
  res.json(newUser)
})

// DELETE user from room
app.delete('/api/rooms/:roomId/users/:id', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const id = parseInt(req.params.id)
  const index = users.findIndex(u => u.id === id && u.roomId === roomId)
  if (index !== -1) {
    users.splice(index, 1)
    res.json({ success: true })
  } else {
    res.status(404).json({ success: false, message: 'User not found' })
  }
})

// POST assign user to a room
app.post('/api/users/:userId/assign-room', (req, res) => {
  const userId = parseInt(req.params.userId)
  const { roomId } = req.body
  const user = users.find(u => u.id === userId)
  if (user) {
    user.roomId = roomId
    res.json({ success: true, user })
  } else {
    res.status(404).json({ success: false, message: 'User not found' })
  }
})

// GET user by email
app.get("/api/users/email/:email", (req, res) => {
  const email = req.params.email;
  const foundUser = users.find(u => u.email === email);
  console.log('Found user:', foundUser);
  
  if (foundUser) {
    res.json(foundUser);
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
})


// POST register user 
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ 
      success: false, 
      message: 'insufficient data' 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: 'insufficient password length' 
    });
  }

  if (email.length < 5) {
    return res.status(400).json({ 
      success: false, 
      message: 'insufficient email' 
    });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ 
      success: false, 
      message: 'existed user' 
    });
  }

  const newId = Math.max(...users.map(u => u.id), 0) + 1; // TODO sprint 3: real logic for new user id
  
  const newUser = {
    id: newId,
    email: email,
    password: password,
    name: name,
    roomId: null //no room for first time user
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      roomId: newUser.roomId
    }
  });
});

//POST user login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }

  const user = users.find(u => u.email === email);
  
  if (!user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid email or password' 
    });
  }

  if (user.password !== password) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid email or password' 
    });
  }

  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      roomId: user.roomId
    }
  });
});

// ========================================
// CATEGORIES MANAGEMENT
// ========================================
let categories = [
  { id: 1, name: 'Utility' },
  { id: 2, name: 'Groceries' },
  { id: 3, name: 'Maintenance' },
]

// GET all categories
app.get('/api/categories', (req, res) => {
  res.json(categories)
})

// POST new category
app.post('/api/categories', (req, res) => {
  const { name } = req.body
  const newId = Math.max(...categories.map(c => c.id), 0) + 1
  const newCategory = { id: newId, name: name }
  categories.push(newCategory)
  res.json(newCategory)
})

// DELETE category
app.delete('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = categories.findIndex(c => c.id === id)
  if (index !== -1) {
    categories.splice(index, 1)
    res.json({ success: true })
  } else {
    res.status(404).json({ success: false, message: 'Category not found' })
  }
})

// ========================================
// PAYMENTS MANAGEMENT
// ========================================
// TODO: use real data later
let payments = [
  { id: 1, name: 'Pay electricity bill', amount: 120.5, createdAt: '2025-10-20', cleared: false, categoryId: 1, paidBy: 1, owedBy: [1, 2, 3, 4, 5], roomId: 1 },
  { id: 2, name: 'Refill water filter', amount: 35.0, createdAt: '2025-10-18', cleared: true, categoryId: 1, paidBy: 2, owedBy: [1, 2, 3], roomId: 1 },
  { id: 3, name: 'Buy milk', amount: 4.25, createdAt: '2025-10-25', cleared: true, categoryId: 2, paidBy: 3, owedBy: [1, 3, 4], roomId: 1 },
  { id: 4, name: 'Buy vegetables', amount: 18.6, createdAt: '2025-10-26', cleared: false, categoryId: 2, paidBy: 1, owedBy: [1, 2, 5], roomId: 1 },
  { id: 5, name: 'Restock snacks', amount: 22.4, createdAt: '2025-10-23', cleared: false, categoryId: 2, paidBy: 4, owedBy: [1, 2, 3, 4], roomId: 1 },
  { id: 6, name: 'Change air filter', amount: 15.0, createdAt: '2025-10-21', cleared: false, categoryId: 3, paidBy: 5, owedBy: [1, 2, 3, 4, 5], roomId: 1 },
  { id: 7, name: 'Check smoke detector', amount: 10.0, createdAt: '2025-10-19', cleared: true, categoryId: 3, paidBy: 2, owedBy: [2, 3, 5], roomId: 1 },
]

// GET all payments for a specific room
app.get('/api/rooms/:roomId/payments', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const roomPayments = payments.filter(p => p.roomId === roomId)
  res.json(roomPayments)
})

// GET a specific payment by id
app.get('/api/rooms/:roomId/payments/:id', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const id = parseInt(req.params.id)
  const payment = payments.find(p => p.id === id && p.roomId === roomId)
  if (payment) {
    res.json(payment)
  } else {
    res.status(404).json({ success: false, message: 'Payment not found' })
  }
})

// POST new payment to a room
app.post('/api/rooms/:roomId/payments', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const { name, amount, createdAt, cleared, categoryId, paidBy, owedBy } = req.body
  const newId = Math.max(...payments.map(p => p.id), 0) + 1
  const newPayment = {
    id: newId,
    name,
    amount: parseFloat(amount),
    createdAt,
    cleared: Boolean(cleared),
    categoryId: parseInt(categoryId),
    paidBy: parseInt(paidBy),
    owedBy: Array.isArray(owedBy) ? owedBy.map(id => parseInt(id)) : [],
    roomId,
  }
  payments.push(newPayment)
  res.json(newPayment)
})

// PUT (update) an existing payment
// For paymentDetails page
app.put('/api/rooms/:roomId/payments/:id', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const id = parseInt(req.params.id)
  const { name, amount, createdAt, cleared, categoryId, paidBy, owedBy } = req.body

  const index = payments.findIndex(p => p.id === id && p.roomId === roomId)
  if (index !== -1) {
    payments[index] = {
      ...payments[index],
      name: name !== undefined ? name : payments[index].name,
      amount: amount !== undefined ? parseFloat(amount) : payments[index].amount,
      createdAt: createdAt !== undefined ? createdAt : payments[index].createdAt,
      cleared: cleared !== undefined ? Boolean(cleared) : payments[index].cleared,
      categoryId: categoryId !== undefined ? parseInt(categoryId) : payments[index].categoryId,
      paidBy: paidBy !== undefined ? parseInt(paidBy) : payments[index].paidBy,
      owedBy: owedBy !== undefined ? (Array.isArray(owedBy) ? owedBy.map(id => parseInt(id)) : payments[index].owedBy) : payments[index].owedBy,
    }
    res.json(payments[index])
  } else {
    res.status(404).json({ success: false, message: 'Payment not found' })
  }
})

// DELETE payment from room
// Should never need this
app.delete('/api/rooms/:roomId/payments/:id', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const id = parseInt(req.params.id)
  const index = payments.findIndex(p => p.id === id && p.roomId === roomId)
  if (index !== -1) {
    payments.splice(index, 1)
    res.json({ success: true })
  } else {
    res.status(404).json({ success: false, message: 'Payment not found' })
  }
})

// ========================================
// CHORES MANAGEMENT
// ========================================
let chores = [
  { id: 1, name: 'Clean Kitchen', assignedTo: 1, finished: false, roomId: 1 },
  { id: 2, name: 'Take Out Trash', assignedTo: 5, finished: false, roomId: 1 },
  { id: 3, name: 'Vacuum Living Room', assignedTo: 3, finished: true, roomId: 1 },
  { id: 4, name: 'Clean Bathroom', assignedTo: 2, finished: false, roomId: 1 },
]

// GET all chores for a specific room
app.get('/api/rooms/:roomId/chores', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const roomChores = chores.filter(c => c.roomId === roomId)
  res.json(roomChores)
})

// GET a specific chore by id
app.get('/api/rooms/:roomId/chores/:id', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const id = parseInt(req.params.id)
  const chore = chores.find(c => c.id === id && c.roomId === roomId)
  if (chore) {
    res.json(chore)
  } else {
    res.status(404).json({ success: false, message: 'Chore not found' })
  }
})

// POST new chore to a room
app.post('/api/rooms/:roomId/chores', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const { name, assignedTo } = req.body
  const newId = Math.max(...chores.map(c => c.id), 0) + 1
  const newChore = {
    id: newId,
    name,
    assignedTo: parseInt(assignedTo),
    finished: false,
    roomId,
  }
  chores.push(newChore)
  res.json(newChore)
})

// PUT (update) an existing chore
app.put('/api/rooms/:roomId/chores/:id', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const id = parseInt(req.params.id)
  const { name, assignedTo, finished } = req.body

  const index = chores.findIndex(c => c.id === id && c.roomId === roomId)
  if (index !== -1) {
    chores[index] = {
      ...chores[index],
      name: name !== undefined ? name : chores[index].name,
      assignedTo: assignedTo !== undefined ? parseInt(assignedTo) : chores[index].assignedTo,
      finished: finished !== undefined ? Boolean(finished) : chores[index].finished,
    }
    res.json(chores[index])
  } else {
    res.status(404).json({ success: false, message: 'Chore not found' })
  }
})

// DELETE chore from room
app.delete('/api/rooms/:roomId/chores/:id', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const id = parseInt(req.params.id)
  const index = chores.findIndex(c => c.id === id && c.roomId === roomId)
  if (index !== -1) {
    chores.splice(index, 1)
    res.json({ success: true })
  } else {
    res.status(404).json({ success: false, message: 'Chore not found' })
  }
})

// ========================================
// COMPATIBILITY – ROOMMATE ESSAYS
// ========================================

let roommateEssays = [
  {
    id: 1,
    userId: 1,
    roomId: 1,
    title: 'Roommate compatibility essay',
    aboutMe: 'CS student, trains MMA, usually up early and in bed by midnight.',
    idealRoommate: 'Respectful, clean, quiet on weeknights.',
    lifestyleDetails: 'Gym in the morning, study at night.',
    createdAt: '2025-11-01'
  }
];

// GET all roommate essays for a room
app.get('/api/rooms/:roomId/roommate-essays', (req, res) => {
  const roomId = parseInt(req.params.roomId);
  const filtered = roommateEssays.filter(e => e.roomId === roomId);
  res.json(filtered);
});

// GET a single essay
app.get('/api/rooms/:roomId/roommate-essays/:id', (req, res) => {
  const roomId = parseInt(req.params.roomId);
  const id = parseInt(req.params.id);
  const essay = roommateEssays.find(e => e.id === id && e.roomId === roomId);

  if (!essay) {
    return res.status(404).json({ success: false, message: 'Essay not found' });
  }

  res.json(essay);
});

// POST create new essay
app.post('/api/rooms/:roomId/roommate-essays', (req, res) => {
  const roomId = parseInt(req.params.roomId);
  const { userId, title, aboutMe, idealRoommate, lifestyleDetails } = req.body;

  if (!userId || !title || !aboutMe) {
    return res.status(400).json({
      success: false,
      message: 'userId, title, and aboutMe are required'
    });
  }

  const newId = roommateEssays.length > 0
    ? Math.max(...roommateEssays.map(e => e.id)) + 1
    : 1;

  const newEssay = {
    id: newId,
    userId: parseInt(userId),
    roomId,
    title,
    aboutMe,
    idealRoommate: idealRoommate || '',
    lifestyleDetails: lifestyleDetails || '',
    createdAt: new Date().toISOString().slice(0, 10)
  };

  roommateEssays.push(newEssay);
  res.status(201).json(newEssay);
});

// PUT update essay
app.put('/api/rooms/:roomId/roommate-essays/:id', (req, res) => {
  const roomId = parseInt(req.params.roomId);
  const id = parseInt(req.params.id);
  const { title, aboutMe, idealRoommate, lifestyleDetails } = req.body;

  const index = roommateEssays.findIndex(e => e.id === id && e.roomId === roomId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Essay not found' });
  }

  roommateEssays[index] = {
    ...roommateEssays[index],
    title: title ?? roommateEssays[index].title,
    aboutMe: aboutMe ?? roommateEssays[index].aboutMe,
    idealRoommate: idealRoommate ?? roommateEssays[index].idealRoommate,
    lifestyleDetails: lifestyleDetails ?? roommateEssays[index].lifestyleDetails
  };

  res.json(roommateEssays[index]);
});

// DELETE essay
app.delete('/api/rooms/:roomId/roommate-essays/:id', (req, res) => {
  const roomId = parseInt(req.params.roomId);
  const id = parseInt(req.params.id);
  const index = roommateEssays.findIndex(e => e.id === id && e.roomId === roomId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Essay not found' });
  }

  roommateEssays.splice(index, 1);
  res.json({ success: true });
});

// ========================================
// EVENTS MANAGEMENT
// ========================================

// Mock events data
let events = [
  { id: 1, name: 'Birthday Party', date: '2025-11-15', roomId: 1, createdBy: 1, description: 'Celebrate with friends!' },
  { id: 2, name: 'Study Group', date: '2025-11-10', roomId: 1, createdBy: 2, description: 'CS study session.' },
  { id: 3, name: 'Movie Night', date: '2025-11-08', roomId: 1, createdBy: 3, description: 'Movie + snacks in the living room.' },
  { id: 4, name: 'Apartment Inspection', date: '2025-11-20', roomId: 1, createdBy: 1, description: 'Landlord inspection.' },
  { id: 5, name: 'Rent Due', date: '2025-12-01', roomId: 1, createdBy: 4, description: 'Monthly rent payment reminder.' },
  { id: 6, name: 'Holiday Party', date: '2025-12-15', roomId: 1, createdBy: 5, description: 'End-of-year party.' },
]

app.get('/api/rooms/:roomId/events', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const roomEvents = events.filter(e => e.roomId === roomId)
  res.json(roomEvents)
})

app.get('/api/rooms/:roomId/events/:id', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const id = parseInt(req.params.id)

  const event = events.find(e => e.id === id && e.roomId === roomId)

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' })
  }

  res.json(event)
})

// ========================================
// ROOM MANAGEMENT
// ========================================

app.get("/api/users/:email/room-status", (req, res) => {
  const email = req.params.email;
  const foundUser = users.find(u => u.email === email);

  if (foundUser) {
    res.json({
      hasRoom: !!foundUser.roomId,
      roomId: foundUser.roomId
    });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});


export default app

const port = 3000
app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
