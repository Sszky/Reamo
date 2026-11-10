import { readFileSync } from 'node:fs';
import pg from 'pg';

// Supabase ต้องเชื่อมต่อผ่าน SSL
// ถ้ามีไฟล์ CA ของ Supabase (DATABASE_CA_CERT) จะตรวจใบรับรองด้วย
// ถ้าไม่มี ยังเข้ารหัสอยู่ แต่จะไม่ตรวจว่าเซิร์ฟเวอร์ปลายทางเป็นของ Supabase จริง
const caPath = process.env.DATABASE_CA_CERT;
const ssl = caPath
  ? { ca: readFileSync(caPath, 'utf8') }
  : { rejectUnauthorized: false };

// Pool เปิด connection ค้างไว้หลายเส้น แล้วหยิบมาใช้ซ้ำทุก query
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl,
});

// หา profile จาก id ของ Supabase Auth
export async function findProfile(id) {
  const { rows } = await pool.query(
    'SELECT * FROM public.profiles WHERE id = $1',
    [id]
  );
  return rows[0];
}

// สร้าง profile ครั้งแรกที่ผู้ใช้ล็อกอิน
// ON CONFLICT DO NOTHING: ถ้ามีอยู่แล้วจะไม่ทับ ชื่อที่ผู้ใช้แก้เองทีหลังจึงไม่หาย
export async function findOrCreateProfile({ id, displayName, avatarUrl }) {
  await pool.query(
    `INSERT INTO public.profiles (id, display_name, avatar_url)
     VALUES ($1, $2, $3)
     ON CONFLICT (id) DO NOTHING`,
    [id, displayName, avatarUrl]
  );
  return findProfile(id);
}
