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

// หา user จาก google_sub
export async function findUserByGoogleSub(sub) {
  const { rows } = await pool.query(
    'SELECT * FROM public.users WHERE google_sub = $1',
    [sub]
  );
  return rows[0];
}

// หาไม่เจอก็สร้างใหม่ เจอก็อัปเดตข้อมูลล่าสุด
// ON CONFLICT ทำทั้งสองอย่างใน query เดียว และ RETURNING ส่งแถวผลลัพธ์กลับมาเลย
export async function findOrCreateUser({ sub, email, name, picture }) {
  const { rows } = await pool.query(
    `INSERT INTO public.users (google_sub, email, name, picture)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (google_sub) DO UPDATE
       SET email = EXCLUDED.email,
           name = EXCLUDED.name,
           picture = EXCLUDED.picture
     RETURNING *`,
    [sub, email, name, picture]
  );
  return rows[0];
}
