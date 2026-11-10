import express from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { findOrCreateProfile } from './db.js';

const router = express.Router();

// Supabase Auth เป็นคนล็อกอินผู้ใช้ (ทั้งอีเมล/รหัสผ่าน และ Google)
// server ของเราแค่ตรวจว่า token ที่แนบมาเป็นของ Supabase จริง
// โดยใช้ public key ที่ Supabase เปิดให้ดาวน์โหลด (ไม่ต้องเก็บ secret เอง)
const issuer = `${process.env.SUPABASE_URL}/auth/v1`;
const keys = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));

// ── middleware ตรวจ token ──────────────────────────
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const { payload } = await jwtVerify(token, keys, {
      issuer,
      audience: 'authenticated',
    });

    req.user = {
      id: payload.sub,
      email: payload.email,
      metadata: payload.user_metadata || {},
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ── GET /auth/me ───────────────────────────────────
// เรียกหลังล็อกอินทุกครั้ง: ครั้งแรกจะสร้าง profile ให้
router.get('/me', requireAuth, async (req, res) => {
  const { id, email, metadata } = req.user;

  try {
    const profile = await findOrCreateProfile({
      id,
      // สมัครด้วยอีเมลจะได้ display_name จากฟอร์ม ส่วน Google จะได้ full_name
      displayName: metadata.display_name || metadata.full_name || metadata.name || null,
      avatarUrl: metadata.avatar_url || metadata.picture || null,
    });

    res.json({
      user: {
        id: profile.id,
        email,
        displayName: profile.display_name,
        avatarUrl: profile.avatar_url,
      },
    });
  } catch (err) {
    console.error('Loading profile failed:', err.message);
    res.status(500).json({ error: 'Could not load profile' });
  }
});

export default router;
