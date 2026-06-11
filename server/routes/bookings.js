const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.userId]
    );
    const jobs = result.rows.map(formatBooking);
    return res.json({ jobs });
  } catch (err) {
    console.error('Get bookings error:', err);
    return res.status(500).json({ error: 'Failed to load jobs' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { techId, techName, techInitials, techColor, scheduledSlot, address, instructions, amount, category, diagnosisId } = req.body;

  if (!techName || !scheduledSlot || !address) {
    return res.status(400).json({ error: 'Technician, time slot, and address are required' });
  }

  const id = 'FX-' + Math.floor(1000 + Math.random() * 9000);
  const title = `${category || 'Repair'} – Service Request`;
  const dateLabel = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  try {
    const result = await db.query(
      `INSERT INTO bookings
        (id, user_id, diagnosis_id, tech_id, tech_name, tech_initials, tech_color,
         scheduled_slot, address, instructions, amount, status, category, title, eta, date_label)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'scheduled',$12,$13,$14,$15)
       RETURNING *`,
      [id, req.userId, diagnosisId || null, techId || 1, techName, techInitials || 'TN',
       techColor || '#3B82F6', scheduledSlot, address, instructions || '',
       amount || 170, category || 'Repair', title, scheduledSlot, dateLabel]
    );
    return res.status(201).json({ job: formatBooking(result.rows[0]) });
  } catch (err) {
    console.error('Create booking error:', err);
    return res.status(500).json({ error: 'Failed to create booking' });
  }
});

router.patch('/:id/complete', requireAuth, async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE bookings SET status='completed', completed_at=NOW()
       WHERE id=$1 AND user_id=$2 RETURNING *`,
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    return res.json({ job: formatBooking(result.rows[0]) });
  } catch (err) {
    console.error('Complete booking error:', err);
    return res.status(500).json({ error: 'Failed to update booking' });
  }
});

router.patch('/:id/review', requireAuth, async (req, res) => {
  const { rating, review } = req.body;
  try {
    const result = await db.query(
      `UPDATE bookings SET rating=$1, review=$2 WHERE id=$3 AND user_id=$4 RETURNING *`,
      [rating || 5, review || '', req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    return res.json({ job: formatBooking(result.rows[0]) });
  } catch (err) {
    console.error('Review booking error:', err);
    return res.status(500).json({ error: 'Failed to save review' });
  }
});

function formatBooking(row) {
  return {
    id: row.id,
    title: row.title || 'Service Request',
    category: row.category || 'Repair',
    tech: row.tech_name,
    techInitials: row.tech_initials,
    techColor: row.tech_color,
    date: row.date_label || new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    amount: parseFloat(row.amount),
    status: row.status,
    rating: parseFloat(row.rating) || 0,
    eta: row.eta,
    review: row.review || undefined,
  };
}

module.exports = router;
