import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import {
  databaseName,
  fetchForestByZone,
  fetchStats,
  initDatabase,
  pool,
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const VALID_BARRIERS = new Set(['bamboo', 'rock', 'mixed']);
const BARRIER_LABELS_TH = {
  bamboo: 'แนวไม้ไผ่ชะลอคลื่น',
  rock: 'แนวคันหินป้องกันการกัดเซาะ',
  mixed: 'แนวผสมผสาน (ไม้ไผ่ + คันหิน)',
};

function resolvePort() {
  const devPortArg = process.argv.find((arg) => arg.startsWith('--dev-port='));
  if (devPortArg) {
    const parsed = Number(devPortArg.split('=')[1]);
    if (Number.isInteger(parsed) && parsed > 0) return parsed;
  }
  return Number(process.env.PORT || 3000);
}

function escapeCsvCell(value) {
  const str = String(value ?? '');
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatParticipationRow(row) {
  return {
    id: row.id,
    studentId: row.student_id,
    reflection: row.reflection,
    coastalZoneCode: row.coastal_zone_code,
    coastalZoneName: row.coastal_zone_name || row.coastal_zone_code,
    barrierType: row.barrier_type,
    barrierSegments: row.barrier_segments,
    triedWithoutBarrier: Boolean(row.tried_without_barrier),
    mangrovesPlanted: row.mangroves_planted,
    landRecoveredSqm: Number(row.land_recovered_sqm),
    treeX: Number(row.tree_x),
    treeY: Number(row.tree_y),
    createdAt: row.created_at,
  };
}

const app = express();
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS now');
    res.json({
      status: 'ok',
      database: databaseName,
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/zones', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        code,
        name_th,
        subtitle_th,
        wave_intensity,
        erosion_level_th,
        description_th,
        real_context_th
      FROM coastal_zones
      ORDER BY wave_intensity DESC
    `);
    res.json({ zones: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'ไม่สามารถโหลดข้อมูลพื้นที่ชายฝั่งได้' });
  }
});

app.get('/api/forest', async (_req, res) => {
  try {
    const treesByZone = await fetchForestByZone();
    res.json({ treesByZone });
  } catch (error) {
    res.status(500).json({ error: 'ไม่สามารถโหลดข้อมูลผืนป่าแต่ละโซนได้' });
  }
});

app.get('/api/stats', async (_req, res) => {
  try {
    const stats = await fetchStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'ไม่สามารถโหลดสถิติได้' });
  }
});

app.get('/api/participations', async (req, res) => {
  try {
    const { zone, barrier, q, limit } = req.query;
    const conditions = [];
    const params = [];

    if (zone && typeof zone === 'string' && zone !== 'all') {
      params.push(zone);
      conditions.push(`p.coastal_zone_code = $${params.length}`);
    }

    if (barrier && typeof barrier === 'string' && VALID_BARRIERS.has(barrier)) {
      params.push(barrier);
      conditions.push(`p.barrier_type = $${params.length}`);
    }

    if (q && typeof q === 'string' && q.trim().length > 0) {
      params.push(`%${q.trim()}%`);
      conditions.push(
        `(p.student_id ILIKE $${params.length} OR p.reflection ILIKE $${params.length})`
      );
    }

    const parsedLimit = Math.min(Math.max(Number(limit) || 100, 1), 500);
    params.push(parsedLimit);

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.student_id,
        p.reflection,
        p.coastal_zone_code,
        z.name_th AS coastal_zone_name,
        p.barrier_type,
        p.barrier_segments,
        p.tried_without_barrier,
        p.mangroves_planted,
        p.land_recovered_sqm,
        p.tree_x,
        p.tree_y,
        p.created_at
      FROM participations p
      JOIN coastal_zones z ON z.code = p.coastal_zone_code
      ${whereClause}
      ORDER BY p.created_at DESC, p.id DESC
      LIMIT $${params.length}
      `,
      params
    );

    res.json({
      items: result.rows.map(formatParticipationRow),
    });
  } catch (error) {
    res.status(500).json({ error: 'ไม่สามารถโหลดข้อมูลผู้เข้าร่วมได้' });
  }
});

app.post('/api/participations', async (req, res) => {
  try {
    const body = req.body || {};
    const studentId = String(body.studentId ?? '').trim();
    const reflection = String(body.reflection ?? '').trim();
    const coastalZoneCode = String(body.coastalZoneCode ?? '').trim();
    const barrierType = String(body.barrierType ?? 'rock').trim();
    const barrierSegments = Number.parseInt(body.barrierSegments ?? 5, 10);
    const triedWithoutBarrier = Boolean(body.triedWithoutBarrier);
    const requestedTrees =
      body.mangrovesPlanted === undefined ? 1 : Number.parseInt(body.mangrovesPlanted, 10);
    const landRecoveredSqm = Number(body.landRecoveredSqm ?? 0);
    const treeX = Number(body.treeX);
    const treeY = Number(body.treeY);

    if (studentId.length < 3 || studentId.length > 32) {
      return res.status(400).json({
        error: 'กรุณากรอกรหัสนักศึกษาให้ถูกต้อง (3–32 ตัวอักษร)',
      });
    }

    if (reflection.length < 2 || reflection.length > 240) {
      return res.status(400).json({
        error: 'กรุณาเขียนความรู้สึกสั้นๆ หลังร่วมกิจกรรม (2–240 ตัวอักษร)',
      });
    }

    if (!VALID_BARRIERS.has(barrierType)) {
      return res.status(400).json({
        error: 'ประเภทแนวป้องกันคลื่นไม่ถูกต้อง',
      });
    }

    if (!Number.isInteger(barrierSegments) || barrierSegments < 1 || barrierSegments > 20) {
      return res.status(400).json({
        error: 'จำนวนจุดแนวป้องกันคลื่นต้องอยู่ระหว่าง 1–20 จุด',
      });
    }

    if (requestedTrees !== 1) {
      return res.status(400).json({
        error: 'จำกัดการปลูก 1 คนต่อ 1 ต้นเท่านั้น',
      });
    }

    if (!Number.isFinite(treeX) || treeX < 0.07 || treeX > 0.57) {
      return res.status(400).json({
        error: 'ตำแหน่งแกน X ของต้นไม้ไม่อยู่ในพื้นที่ปลูก',
      });
    }

    if (!Number.isFinite(treeY) || treeY < 0.4 || treeY > 0.94) {
      return res.status(400).json({
        error: 'ตำแหน่งแกน Y ของต้นไม้ไม่อยู่ในพื้นที่ปลูก',
      });
    }

    if (!Number.isFinite(landRecoveredSqm) || landRecoveredSqm < 0 || landRecoveredSqm > 500) {
      return res.status(400).json({
        error: 'ค่าพื้นที่ดินงอกคืนไม่ถูกต้อง',
      });
    }

    const zoneCheck = await pool.query(
      'SELECT code, name_th FROM coastal_zones WHERE code = $1',
      [coastalZoneCode]
    );
    if (zoneCheck.rowCount === 0) {
      return res.status(400).json({ error: 'ไม่พบพื้นที่ชายฝั่งที่เลือก' });
    }

    const insertResult = await pool.query(
      `
      INSERT INTO participations (
        student_id,
        reflection,
        coastal_zone_code,
        barrier_type,
        barrier_segments,
        tried_without_barrier,
        mangroves_planted,
        land_recovered_sqm,
        tree_x,
        tree_y
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
      `,
      [
        studentId,
        reflection,
        coastalZoneCode,
        barrierType,
        barrierSegments,
        triedWithoutBarrier,
        1,
        Number(landRecoveredSqm.toFixed(1)),
        Number(treeX.toFixed(4)),
        Number(treeY.toFixed(4)),
      ]
    );

    const created = formatParticipationRow({
      ...insertResult.rows[0],
      coastal_zone_name: zoneCheck.rows[0].name_th,
    });
    const [stats, treesByZone] = await Promise.all([fetchStats(), fetchForestByZone()]);

    res.status(201).json({
      participation: created,
      stats,
      treesByZone,
    });
  } catch (error) {
    console.error('[api] POST /api/participations error:', error);
    res.status(500).json({ error: 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' });
  }
});

app.get('/api/participations/export.csv', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.student_id,
        p.reflection,
        z.name_th AS coastal_zone_name,
        p.barrier_type,
        p.barrier_segments,
        p.tried_without_barrier,
        p.mangroves_planted,
        p.land_recovered_sqm,
        p.tree_x,
        p.tree_y,
        p.created_at
      FROM participations p
      JOIN coastal_zones z ON z.code = p.coastal_zone_code
      ORDER BY p.id ASC
    `);

    const header = [
      'ลำดับ',
      'รหัสนักศึกษา',
      'ความรู้สึกหลังร่วมกิจกรรม',
      'พื้นที่ชายฝั่ง',
      'แนวป้องกันคลื่นที่จำลอง',
      'จำนวนจุดแนวกันคลื่น',
      'ลองปลูกก่อนวางแนว',
      'จำนวนต้นโกงกางที่ปลูก',
      'ผืนดินงอกคืน (ตร.ม.)',
      'พิกัด X',
      'พิกัด Y',
      'เวลาที่บันทึก',
    ];

    const lines = [header.map(escapeCsvCell).join(',')];
    for (const row of result.rows) {
      lines.push(
        [
          row.id,
          row.student_id,
          row.reflection,
          row.coastal_zone_name,
          BARRIER_LABELS_TH[row.barrier_type] || row.barrier_type,
          row.barrier_segments,
          row.tried_without_barrier ? 'ลองปลูกก่อน' : 'วางแนวทันที',
          row.mangroves_planted,
          row.land_recovered_sqm,
          row.tree_x,
          row.tree_y,
          new Date(row.created_at).toLocaleString('th-TH', {
            timeZone: 'Asia/Bangkok',
          }),
        ]
          .map(escapeCsvCell)
          .join(',')
      );
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="kongkang-participations.csv"'
    );
    res.send(`\uFEFF${lines.join('\r\n')}`);
  } catch (error) {
    res.status(500).json({ error: 'ไม่สามารถส่งออกไฟล์ CSV ได้' });
  }
});

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    return res.sendFile(path.join(distDir, 'index.html'));
  });
}

const port = resolvePort();

async function start() {
  try {
    await initDatabase();
    app.listen(port, () => {
      console.log(
        `[server] Protect & Plant the KONGKANG listening on http://localhost:${port} (DB: ${databaseName})`
      );
    });
  } catch (error) {
    console.error('[server] Startup failed:', error);
    process.exit(1);
  }
}

start();
