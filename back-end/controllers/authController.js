const { validationResult, body } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../services/authService');

// Validation chains directly inside controller (signup)
exports.signup = [
  // Validation rules
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  // Controller logic
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('🔄 === SIGNUP ENDPOINT CALLED ===');
      const { name, email, password } = req.body;
      console.log('🔄 Signup request received:', { name, email });

      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'Email already in use' });

      const user = new User({ name, email, password });
      await user.save();

      const token = generateToken(user);
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ error: 'Signup failed' });
    }
  }
];

// Validation and controller for login
exports.login = [
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('🔄 === LOGIN ENDPOINT CALLED ===');
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'Invalid credentials' });

      const match = await user.comparePassword(password);
      if (!match) return res.status(400).json({ error: 'Invalid credentials' });

      const token = generateToken(user);
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
];

// Your existing me controller stays the same
exports.me = async (req, res) => {
  try {
    console.log('🔄 === ME ENDPOINT CALLED ===');
    const user = await User.findById(req.user._id).select('-password');
    console.log(user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user info' });
  }
};
