const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { formatUser } = require('./auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, name, phone, address, plan, member_since FROM users WHERE id = $1',
      [req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    return res.json({ profile: formatUser(result.rows[0]) });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ error: 'Failed to load profile' });
  }
});

router.patch('/', requireAuth, async (req, res) => {
  const { name, phone, address } = req.body;
  try {
    const result = await db.query(
      `UPDATE users SET
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        address = COALESCE($3, address),
        updated_at = NOW()
       WHERE id = $4
       RETURNING id, email, name, phone, address, plan, member_since`,
      [name || null, phone || null, address || null, req.userId]
    );
    return res.json({ profile: formatUser(result.rows[0]) });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
