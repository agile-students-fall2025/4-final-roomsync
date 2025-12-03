import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
//jwt middlewares
import jwt from 'jsonwebtoken'
import jwtStrategy from './config/jwt-config.js' // import setup options for using JWT in passport
import passport from 'passport'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import morgan from 'morgan'



const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

passport.use(jwtStrategy)
app.use(passport.initialize())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors({ origin: process.env.FRONT_END_DOMAIN, credentials: true })) // allow incoming requests only from a "trusted" host


// basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to RoomSync API' })
})

// example route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// database connection test route
// this is just for me debugging and setting up database
app.get('/api/db-test', (req, res) => {
  const dbState = mongoose.connection.readyState
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }
  res.json({
    status: dbState === 1 ? 'ok' : 'error',
    database: states[dbState],
    message: dbState === 1 ? 'MongoDB is connected' : 'MongoDB is not connected'
  })
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

//Call models here
import authenticationRoutes from './routes/authentication-routes.js'
import cookieRoutes from './routes/cookie-routes.js'
import choreRoutes from './routes/chore-routes.js'
import eventRoutes from './routes/event-routes.js'
import roomRoutes from './routes/room-routes.js'
import profileRoutes from './routes/profile-routes.js'
import roommateRoutes from './routes/roommate-routes.js'
import roommateEssayRoutes from './routes/roommate-essay-routes.js'

// ========================================
// SPECIALIZED ROUTING FILES
// ========================================
app.use('/auth', authenticationRoutes()) // all requests for /auth/* will be handled by the authenticationRoutes router
app.use('/cookie', cookieRoutes()) // all requests for /cookie/* will be handled by the cookieRoutes router
app.use('/api', choreRoutes()) // all requests for /api/rooms/:roomId/chores/* will be handled by the choreRoutes router
app.use('/api', eventRoutes()) // all requests for /api/rooms/:roomId/events/* will be handled by the eventRoutes router
app.use('/api/rooms', roomRoutes())
app.use('/api', profileRoutes()) // all requests for /api/users/:userId/profile/* will be handled by profileRoutes
app.use('/api/roommates', roommateRoutes())
app.use('/api', roommateEssayRoutes())

// ========================================
// MONGOOSE CONNECTION
// ========================================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`Successfully connected to MongoDB at ${process.env.MONGODB_URI}`)
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err.message}`)
    console.error('User account authentication will fail')
  })


// ========================================
// USER MANAGEMENT
// ========================================
// let users = [
//   { id: 1, email: "brian@agile.com", name: "Brian", password: "123456", roomId: 1 },
//   { id: 2, email: "ginny@agile.com", name: "Ginny", password: "789101", roomId: 1 },
//   { id: 3, email: "jacob@agile.com", name: "Jacob", password: "213141", roomId: 1 },
//   { id: 4, email: "amish@agile.com", name: "Amish", password: "516171", roomId: 1 },
//   { id: 5, email: "eslem@agile.com", name: "Eslem", password: "819202", roomId: 1 },
// ]


// GET user by userId
app.get("/api/users/:userId", (req, res) => {
  const email = req.params.userId;
  const foundUser = users.find(u => u._id === userId);
  console.log('Found user:', foundUser);
  
  if (foundUser) {
    res.json(foundUser);
  } else {
    res.status(404).json({ success: false, message: "User not found" });
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

// GET the room status by email of user
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

// AVAILABLE SPACES MANAGEMENT
let availableSpaces = [
  {
    id: 1,
    roomId: 1,
    title: 'Sunny room near Union Sq',
    neighborhood: 'Union Square / 14th St',
    rent: 1600,
    deposit: 1600,
    startDate: '2025-12-01',
    endDate: '',
    roomType: 'Private',
    amenities: ['Pet-friendly', 'In-unit-Laundry', 'A/C'],
    houseRules: 'Quiet on weeknights, no indoor smoking, guests with heads-up.',
    idealRoommateTags: ['student', 'tidy', 'early riser'],
    createdAt: '2025-11-01',
  },
]

// GET all available spaces for a room
app.get('/api/rooms/:roomId/available-spaces', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const filtered = availableSpaces.filter((s) => s.roomId === roomId)
  res.json(filtered)
})

// GET a single available space
app.get('/api/rooms/:roomId/available-spaces/:id', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const id = parseInt(req.params.id)
  const space = availableSpaces.find((s) => s.id === id && s.roomId === roomId)

  if (!space) {
    return res
      .status(404)
      .json({ success: false, message: 'Space not found' })
  }

  res.json(space)
})

// POST create a new available space
app.post('/api/rooms/:roomId/available-spaces', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const {
    title,
    neighborhood,
    rent,
    deposit,
    startDate,
    endDate,
    roomType,
    amenities,
    houseRules,
    idealRoommateTags,
  } = req.body

  if (!title || !neighborhood || !rent || !roomType) {
    return res.status(400).json({
      success: false,
      message: 'title, neighborhood, rent, and roomType are required',
    })
  }

  const newId =
    availableSpaces.length > 0
      ? Math.max(...availableSpaces.map((s) => s.id)) + 1
      : 1

  const newSpace = {
    id: newId,
    roomId,
    title,
    neighborhood,
    rent: Number(rent),
    deposit:
      deposit !== undefined && deposit !== null && deposit !== ''
        ? Number(deposit)
        : 0,
    startDate: startDate || '',
    endDate: endDate || '',
    roomType,
    amenities: Array.isArray(amenities) ? amenities : [],
    houseRules: houseRules || '',
    idealRoommateTags: Array.isArray(idealRoommateTags)
      ? idealRoommateTags
      : typeof idealRoommateTags === 'string' && idealRoommateTags.length > 0
        ? idealRoommateTags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    createdAt: new Date().toISOString().slice(0, 10),
  }

  availableSpaces.push(newSpace)
  res.status(201).json(newSpace)
})

// PUT update an available space
app.put('/api/rooms/:roomId/available-spaces/:id', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const id = parseInt(req.params.id)
  const {
    title,
    neighborhood,
    rent,
    deposit,
    startDate,
    endDate,
    roomType,
    amenities,
    houseRules,
    idealRoommateTags,
  } = req.body

  const index = availableSpaces.findIndex(
    (s) => s.id === id && s.roomId === roomId
  )

  if (index === -1) {
    return res
      .status(404)
      .json({ success: false, message: 'Space not found' })
  }

  availableSpaces[index] = {
    ...availableSpaces[index],
    title: title ?? availableSpaces[index].title,
    neighborhood: neighborhood ?? availableSpaces[index].neighborhood,
    rent:
      rent !== undefined ? Number(rent) : availableSpaces[index].rent,
    deposit:
      deposit !== undefined
        ? Number(deposit)
        : availableSpaces[index].deposit,
    startDate: startDate ?? availableSpaces[index].startDate,
    endDate: endDate ?? availableSpaces[index].endDate,
    roomType: roomType ?? availableSpaces[index].roomType,
    amenities:
      amenities !== undefined
        ? Array.isArray(amenities)
          ? amenities
          : []
        : availableSpaces[index].amenities,
    houseRules: houseRules ?? availableSpaces[index].houseRules,
    idealRoommateTags:
      idealRoommateTags !== undefined
        ? Array.isArray(idealRoommateTags)
          ? idealRoommateTags
          : typeof idealRoommateTags === 'string' &&
            idealRoommateTags.length > 0
            ? idealRoommateTags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            : []
        : availableSpaces[index].idealRoommateTags,
  }

  res.json(availableSpaces[index])
})

// DELETE an available space
app.delete('/api/rooms/:roomId/available-spaces/:id', (req, res) => {
  const roomId = parseInt(req.params.roomId)
  const id = parseInt(req.params.id)
  const index = availableSpaces.findIndex(
    (s) => s.id === id && s.roomId === roomId
  )

  if (index === -1) {
    return res
      .status(404)
      .json({ success: false, message: 'Space not found' })
  }

  availableSpaces.splice(index, 1)
  res.json({ success: true })
})

// POTENTIAL ROOMMATES (VIEW-ONLY)
let potentialRoommates = [
  {
    id: 1,
    name: 'Alex Kim',
    budget: '$1,600–$1,800',
    areas: ['Union Square', 'East Village'],
    tags: ['student', 'early riser', 'gym'],
    essay: {
      about:
        'CS student who trains MMA and lifts. Pretty focused during the week, more social on weekends.',
      prefs:
        'Prefer a fairly tidy place, quiet-ish on weeknights, totally fine with guests as long as there is a heads-up.',
      dealbreakers:
        'Full-time party house, smoking inside the apartment, or people who never clean shared spaces.',
    },
  },
  {
    id: 2,
    name: 'Jordan Lee',
    budget: '$1,400–$1,600',
    areas: ['Brooklyn Heights', 'Lower Manhattan'],
    tags: ['grad student', 'night owl', 'music'],
    essay: {
      about:
        'Grad student who produces music on headphones on low volume. Laid-back and friendly.',
      prefs:
        'Okay with some noise later at night, prefers roommates who communicate directly about issues.',
      dealbreakers:
        'Passive-aggressive notes, people who never pay their share on time.',
    },
  },
  {
    id: 3,
    name: 'Taylor Rivera',
    budget: '$1,700–$2,000',
    areas: ['Chelsea', 'Flatiron'],
    tags: ['professional', 'tidy', 'chef'],
    essay: {
      about:
        'Young professional working hybrid. Loves cooking and sharing meals if roommates are down.',
      prefs:
        'Really values cleanliness in the kitchen and bathroom, open communication about guests.',
      dealbreakers:
        'Unwashed dishes piling up for days, surprise overnight guests every week.',
    },
  },
]

// GET all potential roommates
app.get('/api/potential-roommates', (req, res) => {
  res.json(potentialRoommates)
})

// GET a single potential roommate by id
app.get('/api/potential-roommates/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const roommate = potentialRoommates.find((r) => r.id === id)

  if (!roommate) {
    return res
      .status(404)
      .json({ success: false, message: 'Potential roommate not found' })
  }

  res.json(roommate)
})

// ========================================
// LOOING FOR MANAGEMENT
// ========================================
let potentialRooms = [
  {
    id: 1,
    listingName: 'TheBestBuilding',
    owner: {
      id: 'amish',
      name: 'Amish',
      budget: '$1.2k–$1.6k',
      areas: ['LES', 'East Village'],
      tags: ['Non-smoker', 'Dog-friendly', 'Organized'],
      blurb: 'Works hybrid, cooks often, likes clean common areas.',
      photo: null,
      essay: {
        about: 'Analyst, hybrid schedule. Chill on weeknights.',
        prefs: 'Split essentials, keep counters clean.',
        dealbreakers: 'Noise after midnight midweek.'
      }
    },
    location: '123 3rd Ave, New York',
    monthlyRent: 1600,
    deposit: null,
    bedroom: 'studio',
    bathroom: '1',
    amenities: ['Wi-Fi', 'Elevator', 'Furnished'],
    rules: 'no smoking',
    photo: null
  },
  {
    id: 2,
    listingName: 'TheGreatestBuilding',
    owner: {
      id: 'eslem',
      name: 'Eslem',
      budget: '$1.5k–$1.9k',
      areas: ['Chelsea', 'Flatiron'],
      tags: ['Student', 'Gym', 'Quiet hours'],
      blurb: 'Design student. Quiet, focused, weekends social.',
      photo: null,
      essay: {
        about: 'Parsons design student; studio late some nights.',
        prefs: 'Quiet hours 11pm–7am.',
        dealbreakers: 'Pets with severe shedding.'
      }
    },
    location: '456 Metropolitan Ave, Brooklyn',
    monthlyRent: 3000,
    deposit: null,
    bedroom: '2',
    bathroom: '1.5',
    amenities: ['Elevator', 'Furnished', 'Doorman'],
    rules: 'no shoes indoor',
    photo: null
  }
]

// GET all potential rooms
app.get('/api/potential-rooms', (req, res) => {
  res.json(potentialRooms)
})

// GET a single potential room by id
app.get('/api/potential-rooms/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const room = potentialRooms.find(r => r.id === id)

  if (!room) {
    return res.status(404).json({ 
      success: false, 
      message: 'Potential room not found' 
    })
  }

  res.json(room)
})

// POST create a new potential room
app.post('/api/potential-rooms', (req, res) => {
  const {
    listingName,
    owner,
    location,
    monthlyRent,
    deposit,
    bedroom,
    bathroom,
    amenities,
    rules,
    photo
  } = req.body

  if (!listingName || !location || !monthlyRent || !bedroom) {
    return res.status(400).json({
      success: false,
      message: 'listingName, location, monthlyRent, and bedroom are required'
    })
  }

  const newId = potentialRooms.length > 0
    ? Math.max(...potentialRooms.map(r => r.id)) + 1
    : 1

  const newRoom = {
    id: newId,
    listingName,
    owner: owner || null,
    location,
    monthlyRent: Number(monthlyRent),
    deposit: deposit !== undefined && deposit !== null ? Number(deposit) : null,
    bedroom,
    bathroom: bathroom || '1',
    amenities: Array.isArray(amenities) ? amenities : [],
    rules: rules || '',
    photo: photo || null
  }

  potentialRooms.push(newRoom)
  res.status(201).json(newRoom)
})

// PUT update a potential room
app.put('/api/potential-rooms/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const {
    listingName,
    owner,
    location,
    monthlyRent,
    deposit,
    bedroom,
    bathroom,
    amenities,
    rules,
    photo
  } = req.body

  const index = potentialRooms.findIndex(r => r.id === id)

  if (index === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Potential room not found' 
    })
  }

  potentialRooms[index] = {
    ...potentialRooms[index],
    listingName: listingName ?? potentialRooms[index].listingName,
    owner: owner !== undefined ? owner : potentialRooms[index].owner,
    location: location ?? potentialRooms[index].location,
    monthlyRent: monthlyRent !== undefined 
      ? Number(monthlyRent) 
      : potentialRooms[index].monthlyRent,
    deposit: deposit !== undefined 
      ? (deposit !== null ? Number(deposit) : null)
      : potentialRooms[index].deposit,
    bedroom: bedroom ?? potentialRooms[index].bedroom,
    bathroom: bathroom ?? potentialRooms[index].bathroom,
    amenities: amenities !== undefined
      ? (Array.isArray(amenities) ? amenities : [])
      : potentialRooms[index].amenities,
    rules: rules ?? potentialRooms[index].rules,
    photo: photo !== undefined ? photo : potentialRooms[index].photo
  }

  res.json(potentialRooms[index])
})

// DELETE a potential room
app.delete('/api/potential-rooms/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = potentialRooms.findIndex(r => r.id === id)

  if (index === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Potential room not found' 
    })
  }

  potentialRooms.splice(index, 1)
  res.json({ success: true })
})
//ROOM ESSAY MANAGEMENT
// POST create new essay
let roomEssay = [
  {
    id: 1,
    title: 'xxx',
    neighborhood: 'West Village',
    minPrice: 2000,
    maxPrice: 4000,
    startDate: '2026-01-01',
    endDate: '2027-01-01',
    roomType: 'Private',
    bedroomSelected: '1',
    bathroomSelected: '2',
    amenities: ['Gym', 'Doorman'],
    createdAt: '2025-11-01',
  },
]
// ========================================
// ROOM ESSAYS MANAGEMENT
// ========================================
let roomEssays = [
  {
    id: 1,
    userId: 1,
    title: 'Room compatibility essay',
    location: 'East Village',
    minPrice: 1200,
    maxPrice: 1800,
    startDate: '2025-12-01',
    endDate: '2026-06-01',
    roomType: 'Private',
    bedroomSelected: '1',
    bathroomSelected: '1+',
    amenities: ['Wi-Fi', 'Laundry', 'A/C'],
    createdAt: '2025-11-01'
  }
]

// GET all room essays for a user
app.get('/api/user/:userId/room-essays', (req, res) => {
  const userId = parseInt(req.params.userId)
  const userEssays = roomEssays.filter(e => e.userId === userId)
  res.json(userEssays)
})

// GET a single room essay by id
app.get('/api/user/:userId/room-essays/:id', (req, res) => {
  const userId = parseInt(req.params.userId)
  const id = parseInt(req.params.id)
  const essay = roomEssays.find(e => e.id === id && e.userId === userId)

  if (!essay) {
    return res.status(404).json({ 
      success: false, 
      message: 'Room essay not found' 
    })
  }

  res.json(essay)
})

// POST create a new room essay
app.post('/api/user/:userId/room-essays', (req, res) => {
  const userId = parseInt(req.params.userId)
  const {
    title,
    location,
    minPrice,
    maxPrice,
    startDate,
    endDate,
    roomType,
    bedroomSelected,
    bathroomSelected,
    amenities
  } = req.body

  if (!title || !location) {
    return res.status(400).json({
      success: false,
      message: 'title and location are required'
    })
  }

  const newId = roomEssays.length > 0
    ? Math.max(...roomEssays.map(e => e.id)) + 1
    : 1

  const newEssay = {
    id: newId,
    userId,
    title,
    location,
    minPrice: minPrice ? Number(minPrice) : null,
    maxPrice: maxPrice ? Number(maxPrice) : null,
    startDate: startDate || '',
    endDate: endDate || '',
    roomType: roomType || 'Private',
    bedroomSelected: bedroomSelected || 'Any',
    bathroomSelected: bathroomSelected || 'Any',
    amenities: Array.isArray(amenities) ? amenities : [],
    createdAt: new Date().toISOString().slice(0, 10)
  }

  roomEssays.push(newEssay)
  res.status(201).json(newEssay)
})

// PUT update a room essay
app.put('/api/user/:userId/room-essays/:id', (req, res) => {
  const userId = parseInt(req.params.userId)
  const id = parseInt(req.params.id)
  const {
    title,
    location,
    minPrice,
    maxPrice,
    startDate,
    endDate,
    roomType,
    bedroomSelected,
    bathroomSelected,
    amenities
  } = req.body

  const index = roomEssays.findIndex(e => e.id === id && e.userId === userId)

  if (index === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Room essay not found' 
    })
  }

  roomEssays[index] = {
    ...roomEssays[index],
    title: title ?? roomEssays[index].title,
    location: location ?? roomEssays[index].location,
    minPrice: minPrice !== undefined 
      ? (minPrice ? Number(minPrice) : null)
      : roomEssays[index].minPrice,
    maxPrice: maxPrice !== undefined 
      ? (maxPrice ? Number(maxPrice) : null)
      : roomEssays[index].maxPrice,
    startDate: startDate ?? roomEssays[index].startDate,
    endDate: endDate ?? roomEssays[index].endDate,
    roomType: roomType ?? roomEssays[index].roomType,
    bedroomSelected: bedroomSelected ?? roomEssays[index].bedroomSelected,
    bathroomSelected: bathroomSelected ?? roomEssays[index].bathroomSelected,
    amenities: amenities !== undefined
      ? (Array.isArray(amenities) ? amenities : [])
      : roomEssays[index].amenities
  }

  res.json(roomEssays[index])
})

// DELETE a room essay
app.delete('/api/user/:userId/room-essays/:id', (req, res) => {
  const userId = parseInt(req.params.userId)
  const id = parseInt(req.params.id)
  const index = roomEssays.findIndex(e => e.id === id && e.userId === userId)

  if (index === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Room essay not found' 
    })
  }

  roomEssays.splice(index, 1)
  res.json({ success: true })
})

export default app
