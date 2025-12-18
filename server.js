require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/database')
const authRoutes = require('./routes/authRoutes')
const blogRoutes = require('./routes/blogRoutes')

const app = express()

// Connect to MongoDB
connectDB()

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5175', 'http://127.0.0.1:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Routes
app.use('/api', authRoutes)
app.use('/api/blogs', blogRoutes)

// Stats route
const auth = require('./middleware/auth')
const { getStats } = require('./controllers/blogController')
app.get('/api/stats', auth, getStats)

const PORT = process.env.PORT || 5000
app.listen(PORT, (err) => {
  if (err) {
    console.error('Server failed to start:', err)
    process.exit(1)
  }
  console.log(`Server running on port ${PORT}`)
}).on('error', (err) => {
  console.error('Server error:', err)
})