const express = require('express');
const db = require('../db');
const { signToken, requireAuth } = require('../middleware/auth');
const { supabaseAdmin, supabaseAnon } = require('../supabase');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: { name: name.trim() },
    });

    if (error) {
      if (/already been registered|already exists/i.test(error.message || '')) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }
      console.error('Supabase createUser error:', error);
      return res.status(500).json({ error: 'Registration failed, please try again' });
    }

    const supaUser = data.user;
    const memberSince = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const result = await db.query(
      `INSERT INTO users (id, email, name, member_since)
       VALUES ($1, $2, $3, $4) RETURNING id, email, name, phone, address, plan, member_since`,
      [supaUser.id, normalizedEmail, name.trim(), memberSince]
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

  const normalizedEmail = email.toLowerCase();

  try {
    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const supaUser = data.user;

    let result = await db.query(
      'SELECT id, email, name, phone, address, plan, member_since FROM users WHERE id = $1',
      [supaUser.id]
    );

    if (result.rows.length === 0) {
      // Edge case: user exists in Supabase but not yet synced locally
      const memberSince = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const name = supaUser.user_metadata?.name || normalizedEmail.split('@')[0];
      result = await db.query(
        `INSERT INTO users (id, email, name, member_since)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email
         RETURNING id, email, name, phone, address, plan, member_since`,
        [supaUser.id, normalizedEmail, name, memberSince]
      );
    }

    const user = result.rows[0];
    const token = signToken(user.id, user.email);
    return res.json({ token, user: formatUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed, please try again' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    await supabaseAnon.auth.resetPasswordForEmail(normalizedEmail);
  } catch (err) {
    console.error('Forgot password error:', err);
    // fall through — always return success to avoid leaking which emails exist
  }

  // Always respond success (don't reveal whether the email is registered)
  return res.json({ ok: true, message: 'If an account exists for that email, a reset link has been sent.' });
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
