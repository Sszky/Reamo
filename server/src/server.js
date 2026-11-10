import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './auth.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Reamo API is running' });
});

app.use('/auth', authRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});