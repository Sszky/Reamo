import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = '7d';

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      name: user.name,
    },
    SECRET,
    { expiresIn: EXPIRES_IN }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, SECRET);
}