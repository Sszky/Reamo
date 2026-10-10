import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import { findOrCreateUser } from './db.js';
import { signAccessToken, verifyAccessToken } from './jwt.js';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── POST /auth/google ──────────────────────────────
router.post('/google', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'idToken is required' });
  }

  try {
    // 1) ตรวจลายเซ็นกับ Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // 2) แกะข้อมูล user ออกมา
    const payload = ticket.getPayload();

    if (!payload.email_verified) {
      return res.status(403).json({ error: 'Email not verified by Google' });
    }

    // 3) หา user ในฐานข้อมูล ไม่มีก็สร้าง
    const user = findOrCreateUser({
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    });

    // 4) ออก token ของเราเอง
    const accessToken = signAccessToken(user);

    // 5) ส่งกลับ
    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (err) {
    console.error('Google auth failed:', err.message);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// ── middleware ตรวจ token ──────────────────────────
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ── GET /auth/me ───────────────────────────────────
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;