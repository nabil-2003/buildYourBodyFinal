const jwt = require('jsonwebtoken');
const User = require('../models/User');

function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function authenticate(req, res, next) {
  console.log('=== AUTHENTICATION DEBUG ===');
  console.log('Request path:', req.path);
  console.log('Authorization header:', req.headers.authorization);
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No valid authorization header found');
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  console.log('Token extracted:', token ? 'Token exists' : 'No token');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', { id: decoded.id, email: decoded.email });
    
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      console.log('User not found in database');
      return res.status(401).json({ error: 'User not found' });
    }
    
    console.log('User authenticated successfully:', { id: req.user._id, email: req.user.email });
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { generateToken, authenticate }; 