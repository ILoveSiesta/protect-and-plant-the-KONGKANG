import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbDir = path.resolve(__dirname, '..', 'db');

export const databaseName = process.env.PGDATABASE || process.env.POSTGRES_DB || 'kongkang';

const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT || process.env.POSTGRES_PORT || 5434),
      database: databaseName,
      user: process.env.PGUSER || process.env.POSTGRES_USER || 'kongkang',
      password: process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || 'kongkang_pass',
    };

export const pool = new Pool({
  ...poolConfig,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Initialize database tables and seed Bang Khun Thian coastal zones idempotently.
 * Retries briefly to allow PostgreSQL in Docker to finish starting up.
 */
export async function initDatabase(maxAttempts = 15) {
  const initSql = fs.readFileSync(path.join(dbDir, 'init.sql'), 'utf8');

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await pool.query(initSql);
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      console.warn(
        `[db] Waiting for PostgreSQL (${attempt}/${maxAttempts}): ${error.message}`
      );
      await sleep(1000);
    }
  }
}

/**
 * Truncate participant entries and restart sequence while keeping coastal_zones.
 */
export async function resetParticipations() {
  const resetSql = fs.readFileSync(path.join(dbDir, 'reset.sql'), 'utf8');
  await pool.query(resetSql);
}

/**
 * Fetch saved mangrove tree coordinates grouped separately per coastal zone.
 */
export async function fetchForestByZone() {
  const zonesResult = await pool.query('SELECT code FROM coastal_zones');
  const treesByZone = {};
  for (const z of zonesResult.rows) {
    treesByZone[z.code] = [];
  }

  const treesResult = await pool.query(`
    SELECT
      id,
      student_id,
      coastal_zone_code,
      tree_x,
      tree_y,
      reflection,
      created_at
    FROM participations
    ORDER BY id ASC
  `);

  for (const row of treesResult.rows) {
    if (!treesByZone[row.coastal_zone_code]) {
      treesByZone[row.coastal_zone_code] = [];
    }
    treesByZone[row.coastal_zone_code].push({
      id: row.id,
      studentId: row.student_id,
      x: Number(row.tree_x),
      y: Number(row.tree_y),
      reflection: row.reflection,
      createdAt: row.created_at,
    });
  }

  return treesByZone;
}

/**
 * Fetch aggregate restoration statistics across all participant records.
 */
export async function fetchStats() {
  const summaryResult = await pool.query(`
    SELECT
      COUNT(*)::int AS total_participants,
      COALESCE(SUM(mangroves_planted), 0)::int AS total_mangroves_planted,
      COALESCE(SUM(land_recovered_sqm), 0)::float AS total_land_recovered_sqm,
      COALESCE(SUM(CASE WHEN tried_without_barrier THEN 1 ELSE 0 END), 0)::int AS tried_without_barrier_count
    FROM participations
  `);

  const barrierResult = await pool.query(`
    SELECT barrier_type, COUNT(*)::int AS count
    FROM participations
    GROUP BY barrier_type
  `);

  const zoneResult = await pool.query(`
    SELECT
      z.code,
      z.name_th,
      COUNT(p.id)::int AS count,
      COALESCE(SUM(p.mangroves_planted), 0)::int AS mangroves_planted
    FROM coastal_zones z
    LEFT JOIN participations p ON p.coastal_zone_code = z.code
    GROUP BY z.code, z.name_th, z.wave_intensity
    ORDER BY z.wave_intensity DESC
  `);

  const summary = summaryResult.rows[0] || {
    total_participants: 0,
    total_mangroves_planted: 0,
    total_land_recovered_sqm: 0,
    tried_without_barrier_count: 0,
  };

  const barrierBreakdown = { bamboo: 0, rock: 0, mixed: 0 };
  for (const row of barrierResult.rows) {
    barrierBreakdown[row.barrier_type] = row.count;
  }

  return {
    totalParticipants: summary.total_participants,
    totalMangrovesPlanted: summary.total_mangroves_planted,
    totalLandRecoveredSqm: Number(Number(summary.total_land_recovered_sqm).toFixed(1)),
    triedWithoutBarrierCount: summary.tried_without_barrier_count,
    barrierBreakdown,
    zoneBreakdown: zoneResult.rows.map((row) => ({
      code: row.code,
      nameTh: row.name_th,
      count: row.count,
      mangrovesPlanted: row.mangroves_planted,
    })),
  };
}
