const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { analyzeIssue } = require('../services/ai');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, category, description, ai_analysis, status, created_at
       FROM diagnoses WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [req.userId]
    );
    const diagnoses = result.rows.map(formatDiagnosis);
    return res.json({ diagnoses });
  } catch (err) {
    console.error('Get diagnoses error:', err);
    return res.status(500).json({ error: 'Failed to load diagnoses' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { category, description } = req.body;
  if (!category) return res.status(400).json({ error: 'Category is required' });

  try {
    const analysis = await analyzeIssue(category, description);

    const result = await db.query(
      `INSERT INTO diagnoses (user_id, category, description, ai_analysis, status)
       VALUES ($1, $2, $3, $4, 'analyzed') RETURNING *`,
      [req.userId, category, description || '', JSON.stringify(analysis)]
    );

    return res.status(201).json({ diagnosis: formatDiagnosis(result.rows[0]) });
  } catch (err) {
    console.error('Create diagnosis error:', err);
    return res.status(500).json({ error: 'Failed to analyze issue' });
  }
});

function formatDiagnosis(row) {
  const analysis = row.ai_analysis || {};
  return {
    id: row.id,
    date: new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    category: row.category,
    issue: analysis.issue || 'Issue detected',
    confidence: analysis.confidence || 80,
    fixedPrice: analysis.fixedPrice || 150,
    severity: analysis.severity || 'Moderate',
    canDIY: analysis.canDIY || false,
    estimatedCost: analysis.estimatedCost || { min: 100, max: 200 },
    estimatedTime: analysis.estimatedTime || '1-2 hours',
    risks: analysis.risks || [],
    immediateSteps: analysis.immediateSteps || [],
    maintenanceTips: analysis.maintenanceTips || [],
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
  };
}

module.exports = router;
