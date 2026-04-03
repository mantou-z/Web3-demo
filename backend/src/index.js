import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import oreRoutes from './routes/ores.js';
import cardRoutes from './routes/cards.js';
import medalRoutes from './routes/medals.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 30001;

app.use(cors());
app.use(express.json());

// Serve static images
app.use('/images', express.static(path.join(__dirname, '../public/images')));

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
