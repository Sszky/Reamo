import Database from 'better-sqlite3';

// เปิด (หรือสร้าง) ไฟล์ฐานข้อมูล
export const db = new Database('reamo.db');

// สร้างตาราง users ถ้ายังไม่มี
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    google_sub  TEXT    UNIQUE NOT NULL,
    email       TEXT    NOT NULL,
    name        TEXT,
    picture     TEXT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

// หา user จาก google_sub
export function findUserByGoogleSub(sub) {
  return db.prepare('SELECT * FROM users WHERE google_sub = ?').get(sub);
}

// สร้าง user ใหม่
export function createUser({ sub, email, name, picture }) {
  const info = db
    .prepare(
      'INSERT INTO users (google_sub, email, name, picture) VALUES (?, ?, ?, ?)'
    )
    .run(sub, email, name, picture);
  return db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
}

// หาไม่เจอก็สร้างใหม่ เจอก็อัปเดตข้อมูลล่าสุด
export function findOrCreateUser(profile) {
  const existing = findUserByGoogleSub(profile.sub);
  if (existing) {
    db.prepare('UPDATE users SET email = ?, name = ?, picture = ? WHERE id = ?')
      .run(profile.email, profile.name, profile.picture, existing.id);
    return findUserByGoogleSub(profile.sub);
  }
  return createUser(profile);
}