require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

 const {rateLimit}= require( 'express-rate-limit');
  const helmet = require('helmet');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
// Debug: Check if environment variables are loaded
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

const authRoutes = require('./routes/authRoutes');
const trainingPlanRoutes = require('./routes/trainingPlanRoutes');
const coachAIRoutes = require('./routes/coachAIRoutes');
const { authenticate } = require('./services/authService');
const app = express();
app.use(limiter); // Apply rate limiting middleware
app.use(helmet()); // Use Helmet for security headers
// Updated CORS configuration
app.use(cors({ 
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());



mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  app.listen(8080, () => console.log('🚀 Server running on port 8080'));
  app.use('/api/auth', authRoutes);
app.use('/api/plans', trainingPlanRoutes);
app.use('/api/coach', coachAIRoutes);


// Test endpoint to verify server is working

// Check if MONGO_URI exists before connecting
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in .env file');
  process.exit(1);
}
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});
