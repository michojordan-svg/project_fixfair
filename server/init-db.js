/**
 * FixFair — Database initialisation + seed script
 *
 * Run once to create all tables and seed technician data:
 *   node server/init-db.js
 *
 * Safe to re-run: uses CREATE TABLE IF NOT EXISTS and INSERT … ON CONFLICT DO NOTHING.
 */

'use strict';

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── users ──────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email         VARCHAR NOT NULL UNIQUE,
        password_hash VARCHAR,
        name          VARCHAR NOT NULL DEFAULT 'New User',
        phone         VARCHAR DEFAULT '',
        address       TEXT    DEFAULT '',
        plan          VARCHAR DEFAULT 'FixFair Pro',
        member_since  VARCHAR DEFAULT '',
        created_at    TIMESTAMP DEFAULT now(),
        updated_at    TIMESTAMP DEFAULT now()
      )
    `);

    // ── diagnoses ──────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS diagnoses (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        category    VARCHAR NOT NULL,
        description TEXT    DEFAULT '',
        ai_analysis JSONB,
        status      VARCHAR DEFAULT 'analyzed',
        video_url   TEXT,
        created_at  TIMESTAMP DEFAULT now()
      )
    `);

    // ── technicians ────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS technicians (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR NOT NULL,
        specialty  VARCHAR,
        rating     NUMERIC,
        jobs_count INTEGER DEFAULT 0,
        price      INTEGER,
        initials   VARCHAR,
        color      VARCHAR,
        verified   BOOLEAN DEFAULT true,
        eta        VARCHAR,
        distance   VARCHAR,
        badges     TEXT[]
      )
    `);

    // ── bookings ───────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id             VARCHAR PRIMARY KEY,
        user_id        UUID    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        diagnosis_id   UUID    REFERENCES diagnoses(id) ON DELETE SET NULL,
        tech_id        INTEGER REFERENCES technicians(id) ON DELETE SET NULL,
        tech_name      VARCHAR,
        tech_initials  VARCHAR,
        tech_color     VARCHAR,
        scheduled_slot VARCHAR,
        address        TEXT,
        instructions   TEXT    DEFAULT '',
        amount         NUMERIC,
        status         VARCHAR DEFAULT 'scheduled',
        category       VARCHAR,
        title          VARCHAR,
        rating         NUMERIC DEFAULT 0,
        review         TEXT    DEFAULT '',
        eta            VARCHAR,
        date_label     VARCHAR,
        created_at     TIMESTAMP DEFAULT now(),
        completed_at   TIMESTAMP
      )
    `);

    // ── appliances ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS appliances (
        id              SERIAL PRIMARY KEY,
        user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name            TEXT NOT NULL,
        category        TEXT NOT NULL DEFAULT 'Appliance',
        brand           TEXT,
        model           TEXT,
        icon            TEXT NOT NULL DEFAULT 'cube',
        color           TEXT NOT NULL DEFAULT '#00d4aa',
        purchased_date  TEXT,
        warranty_expiry TEXT,
        notes           TEXT,
        health          INTEGER NOT NULL DEFAULT 100,
        faults          INTEGER NOT NULL DEFAULT 0,
        last_service    TEXT DEFAULT 'Never',
        repair_cost     INTEGER NOT NULL DEFAULT 0,
        replace_cost    INTEGER NOT NULL DEFAULT 500,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // ── seed technicians (idempotent) ──────────────────────────
    await client.query(`
      INSERT INTO technicians (id, name, specialty, rating, jobs_count, price, initials, color, verified, eta, distance, badges)
      VALUES
        (1, 'Marcus Webb',   'Master Plumber',       4.9, 847, 185, 'MW', '#3B82F6', true, 'Today 2–4 PM',    '1.2 mi', ARRAY['Fast Response','Top Rated']),
        (2, 'Sarah Chen',    'HVAC Specialist',      4.8, 623, 165, 'SC', '#F97316', true, 'Today 4–6 PM',    '2.1 mi', ARRAY['Eco Certified']),
        (3, 'David Park',    'Licensed Electrician', 4.7, 512, 145, 'DP', '#EAB308', true, 'Tomorrow 9 AM',   '3.4 mi', ARRAY[]::TEXT[]),
        (4, 'Maria Torres',  'Appliance Expert',     4.9, 398, 125, 'MT', '#8B5CF6', true, 'Tomorrow 11 AM',  '4.0 mi', ARRAY['Top Rated'])
      ON CONFLICT (id) DO NOTHING
    `);
    await client.query('SELECT setval($1, (SELECT MAX(id) FROM technicians))', ['technicians_id_seq']);

    await client.query('COMMIT');
    console.log('✓ All tables created (or already existed)');
    console.log('✓ Technician seed data applied');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Init failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
