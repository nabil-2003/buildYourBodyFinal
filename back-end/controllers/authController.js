const User = require('../models/User');
const { generateToken } = require('../services/authService');

exports.signup = async (req, res) => {
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
};

exports.login = async (req, res) => {
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
};

exports.me = async (req, res) => {
  try {
    console.log('🔄 === ME ENDPOINT CALLED ===');
    const user = await User.findById(req.user._id).select('-password');
    console.log(user)
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user info' });
  }
}; 