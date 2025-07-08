import express from 'express';
import payload from 'payload';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

// Initialize Payload
const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'nexpa-secret-key',
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${process.env.NEXT_PUBLIC_SERVER_URL}/admin`);
    },
  });

  // Add CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_CLIENT_URL || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Add your own express routes here

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    payload.logger.info(`Nexpa backend listening on port ${PORT}`);
  });
};

start();
