const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS appliances (
      id SERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Appliance',
      brand TEXT,
      model TEXT,
      icon TEXT NOT NULL DEFAULT 'cube',
      color TEXT NOT NULL DEFAULT '#00d4aa',
      purchased_date TEXT,
      warranty_expiry TEXT,
      notes TEXT,
      health INTEGER NOT NULL DEFAULT 100,
      faults INTEGER NOT NULL DEFAULT 0,
      last_service TEXT DEFAULT 'Never',
      repair_cost INTEGER NOT NULL DEFAULT 0,
      replace_cost INTEGER NOT NULL DEFAULT 500,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function daysUntil(dateStr) {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 0;
  return Math.round((d.getTime() - Date.now()) / 86400000);
}

function ageFromDate(dateStr) {
  if (!dateStr) return 'Unknown';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Unknown';
  const yrs = Math.floor((Date.now() - d.getTime()) / (365.25 * 86400000));
  if (yrs < 1) return 'Less than 1 yr';
  return `${yrs} yr${yrs !== 1 ? 's' : ''}`;
}

function healthLabel(h) {
  if (h >= 85) return 'Excellent';
  if (h >= 70) return 'Good';
  if (h >= 50) return 'Fair';
  return 'Poor';
}

function formatAppliance(row) {
  const daysLeft = daysUntil(row.warranty_expiry);
  return {
    id: `A${row.id}`,
    dbId: row.id,
    name: row.name,
    category: row.category,
    brand: row.brand || '',
    model: row.model || '',
    icon: row.icon,
    color: row.color,
    age: ageFromDate(row.purchased_date),
    health: row.health,
    healthLabel: healthLabel(row.health),
    purchased: row.purchased_date || 'Unknown',
    warrantyExpiry: row.warranty_expiry || 'No warranty',
    warrantyDaysLeft: daysLeft,
    faults: row.faults,
    lastService: row.last_service || 'Never',
    repairCost: row.repair_cost,
    replaceCost: row.replace_cost,
    notes: row.notes || '',
    qrCode: `FX-A${row.id}`,
  };
}

const CATEGORY_ICONS = {
  Appliance: { icon: 'cube', color: '#00d4aa' },
  HVAC: { icon: 'snow', color: '#F97316' },
  Plumbing: { icon: 'water', color: '#3B82F6' },
  Electrical: { icon: 'flash', color: '#F59E0B' },
  Roofing: { icon: 'home', color: '#10B981' },
  General: { icon: 'hammer', color: '#8B5CF6' },
};

router.get('/', requireAuth, async (req, res) => {
  try {
    await ensureTable();
    const result = await db.query(
      'SELECT * FROM appliances WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    return res.json({ appliances: result.rows.map(formatAppliance) });
  } catch (err) {
    console.error('Get appliances error:', err);
    return res.status(500).json({ error: 'Failed to load appliances' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { name, category, brand, model, purchased_date, warranty_expiry, notes, replace_cost } = req.body;
  if (!name) return res.status(400).json({ error: 'Appliance name is required' });

  const cat = category || 'Appliance';
  const defaults = CATEGORY_ICONS[cat] || CATEGORY_ICONS.Appliance;

  try {
    await ensureTable();
    const result = await db.query(
      `INSERT INTO appliances
        (user_id, name, category, brand, model, icon, color, purchased_date, warranty_expiry, notes, replace_cost)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        req.userId, name.trim(), cat,
        brand || null, model || null,
        defaults.icon, defaults.color,
        purchased_date || null, warranty_expiry || null,
        notes || null, replace_cost != null ? (parseInt(replace_cost) || 0) : 500,
      ]
    );
    return res.status(201).json({ appliance: formatAppliance(result.rows[0]) });
  } catch (err) {
    console.error('Add appliance error:', err);
    return res.status(500).json({ error: 'Failed to add appliance' });
  }
});

router.patch('/:id', requireAuth, async (req, res) => {
  const { name, brand, model, purchased_date, warranty_expiry, notes, health, faults, last_service, repair_cost, replace_cost } = req.body;
  try {
    await ensureTable();
    const result = await db.query(
      `UPDATE appliances SET
        name = COALESCE($1, name),
        brand = COALESCE($2, brand),
        model = COALESCE($3, model),
        purchased_date = COALESCE($4, purchased_date),
        warranty_expiry = COALESCE($5, warranty_expiry),
        notes = COALESCE($6, notes),
        health = COALESCE($7, health),
        faults = COALESCE($8, faults),
        last_service = COALESCE($9, last_service),
        repair_cost = COALESCE($10, repair_cost),
        replace_cost = COALESCE($11, replace_cost)
       WHERE id = $12 AND user_id = $13
       RETURNING *`,
      [name, brand, model, purchased_date, warranty_expiry, notes, health, faults, last_service, repair_cost, replace_cost, req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Appliance not found' });
    return res.json({ appliance: formatAppliance(result.rows[0]) });
  } catch (err) {
    console.error('Update appliance error:', err);
    return res.status(500).json({ error: 'Failed to update appliance' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await ensureTable();
    await db.query('DELETE FROM appliances WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Delete appliance error:', err);
    return res.status(500).json({ error: 'Failed to delete appliance' });
  }
});

module.exports = router;
