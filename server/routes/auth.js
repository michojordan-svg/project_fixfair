const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { signToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const exists = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const hash = await bcrypt.hash(password, 12);
    const memberSince = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const result = await db.query(
      `INSERT INTO users (email, password_hash, name, member_since)
       VALUES ($1, $2, $3, $4) RETURNING id, email, name, phone, address, plan, member_since`,
      [email.toLowerCase(), hash, name.trim(), memberSince]
    );

    const user = result.rows[0];
    const token = signToken(user.id, user.email);

    return res.status(201).json({ token, user: formatUser(user) });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Registration failed, please try again' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await db.query(
      'SELECT id, email, password_hash, name, phone, address, plan, member_since FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user.id, user.email);
    return res.json({ token, user: formatUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed, please try again' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, name, phone, address, plan, member_since FROM users WHERE id = $1',
      [req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user: formatUser(result.rows[0]) });
  } catch (err) {
    console.error('Get me error:', err);
    return res.status(500).json({ error: 'Failed to load profile' });
  }
});

function formatUser(row) {
  const name = row.name || '';
  const parts = name.trim().split(/\s+/);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();

  return {
    id: row.id,
    email: row.email,
    name,
    firstName: parts[0] || 'User',
    phone: row.phone || '',
    address: row.address || '',
    plan: row.plan || 'FixFair Pro',
    memberSince: row.member_since || '',
    initials,
  };
}

module.exports = router;
module.exports.formatUser = formatUser;
