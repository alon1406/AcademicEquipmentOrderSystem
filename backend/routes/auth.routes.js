const express = require('express');
const router = express.Router();
const { readData } = require('../utils/fileDb');

const USERS_FILE = 'users.json';

// POST /api/auth/login - Authenticate user
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate required fields
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const users = readData(USERS_FILE);

  // Find user by username
  const user = users.find(u => u.username === username);

  if (!user) {
    // Use generic message to prevent username enumeration
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // TODO: [SECURITY] Replace plaintext comparison with bcrypt
  // Future upgrade: const isMatch = await bcrypt.compare(password, user.password);
  // Handle users without password gracefully
  const storedPassword = user.password || '';
  const isPasswordValid = password === storedPassword;

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // TODO: [SECURITY] Generate JWT token here in future
  // Future upgrade: const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

  // Return user data without password - only id, username, and role
  const safeUser = {
    id: user.id,
    username: user.username,
    role: user.role
  };

  res.json({
    message: 'Login successful',
    user: safeUser
  });
});

module.exports = router;
