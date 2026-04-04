import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import oreRoutes from './routes/ores.js';
import cardRoutes from './routes/cards.js';
import medalRoutes from './routes/medals.js';
import { seedDemoDataIfEnabled } from './services/demoSeed.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 30001;
const AI_TIMEOUT = parseInt(process.env.AI_TIMEOUT) || 120000;

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

async function startServer() {
  await seedDemoDataIfEnabled();

  const server = app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`AI timeout: ${AI_TIMEOUT}ms`);
    if (process.env.LOAD_DEMO_DATA === 'true') {
      console.log(`Demo seed enabled for wallet: ${process.env.DEMO_WALLET_ADDRESS || '0xDemo000000000000000000000000000000000001'}`);
    }
  });

  server.timeout = AI_TIMEOUT;
  server.headersTimeout = AI_TIMEOUT + 10000;
  server.keepAliveTimeout = AI_TIMEOUT + 10000;
}

startServer().catch((error) => {
  console.error('Failed to start backend:', error);
  process.exit(1);
});
