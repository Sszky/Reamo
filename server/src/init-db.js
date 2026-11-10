import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { pool } from './db.js';

// สร้างตารางตาม schema.sql: npm run db:init
const sql = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');

try {
  await pool.query(sql);
  console.log('Database is ready');
} catch (err) {
  console.error('Database setup failed:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
