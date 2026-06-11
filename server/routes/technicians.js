const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM technicians ORDER BY rating DESC');
    const technicians = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      specialty: row.specialty,
      rating: parseFloat(row.rating),
      jobs: row.jobs_count,
      price: row.price,
      initials: row.initials,
      color: row.color,
      verified: row.verified,
      eta: row.eta,
      distance: row.distance,
      badges: row.badges || [],
    }));
    return res.json({ technicians });
  } catch (err) {
    console.error('Get technicians error:', err);
    return res.status(500).json({ error: 'Failed to load technicians' });
  }
});

module.exports = router;
