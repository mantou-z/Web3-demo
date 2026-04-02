import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import oreRoutes from './routes/ores.js';
import cardRoutes from './routes/cards.js';
import medalRoutes from './routes/medals.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ores', oreRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/medals', medalRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'alcheme-backend' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
