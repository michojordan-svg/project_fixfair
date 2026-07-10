const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { analyzeIssue } = require('../services/ai');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'videos');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME = new Set([
  'video/webm', 'video/mp4', 'video/quicktime', 'video/x-matroska',
  'audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/ogg', 'audio/wav',
]);
const MAX_UPLOAD_BYTES = 200 * 1024 * 1024; // 200MB safety cap

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = (path.extname(file.originalname || '') || guessExt(file.mimetype)).slice(0, 10);
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

function guessExt(mimetype) {
  if (!mimetype) return '.bin';
  if (mimetype.includes('webm')) return '.webm';
  if (mimetype.includes('mp4')) return '.mp4';
  if (mimetype.includes('quicktime')) return '.mov';
  if (mimetype.includes('matroska')) return '.mkv';
  if (mimetype.includes('mpeg')) return '.mp3';
  if (mimetype.includes('ogg')) return '.ogg';
  if (mimetype.includes('wav')) return '.wav';
  return '.bin';
}

const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error('UNSUPPORTED_MEDIA_TYPE'));
    }
    cb(null, true);
  },
}).single('media');

function handleUpload(req, res, next) {
  upload(req, res, (err) => {
    if (!err) return next();
    if (err.message === 'UNSUPPORTED_MEDIA_TYPE') {
      return res.status(415).json({ error: 'Unsupported media type. Please record video/webm, video/mp4, or audio/webm.' });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'Recording is too large. Please keep it under 200MB (roughly a few minutes).' });
    }
    console.error('Upload error:', err);
    return res.status(400).json({ error: 'Failed to upload recording. Please try again.' });
  });
}

router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, category, description, ai_analysis, status, video_url, created_at
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

router.post('/', requireAuth, handleUpload, async (req, res) => {
  const { category, description } = req.body;
  if (!category) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ error: 'Category is required' });
  }

  if (req.file && req.file.size === 0) {
    fs.unlink(req.file.path, () => {});
    return res.status(400).json({ error: 'The uploaded recording was empty. Please record again.' });
  }

  const videoUrl = req.file ? `/uploads/videos/${path.basename(req.file.path)}` : null;

  try {
    const analysis = await analyzeIssue(category, description);

    const result = await db.query(
      `INSERT INTO diagnoses (user_id, category, description, ai_analysis, status, video_url)
       VALUES ($1, $2, $3, $4, 'analyzed', $5) RETURNING *`,
      [req.userId, category, description || '', JSON.stringify(analysis), videoUrl]
    );

    return res.status(201).json({ diagnosis: formatDiagnosis(result.rows[0]) });
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
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
    videoUrl: row.video_url || null,
    createdAt: row.created_at,
  };
}

module.exports = router;
