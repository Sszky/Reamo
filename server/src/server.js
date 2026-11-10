import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './auth.js';

const app = express();

// trim(): a stray space in .env would otherwise block every request from the website
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.trim(), credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Reamo API is running' });
});

app.use('/auth', authRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});