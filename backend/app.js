import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import adminUserRoutes from './src/routes/adminUsers.js';
import adminStoreRoutes from './src/routes/adminStores.js';
import userRoutes from './src/routes/user.js';
import storeRoutes from './src/routes/store.js';
import ratingRoutes from './src/routes/rating.js';
import authRoutes from './src/routes/auth.js';

import pool from './src/models/db.js';

import { authenticate, authorizeRoles } from './src/middlewares/auth.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

app.use((req, res, next) => {
  req.pgPool = pool;
  next();
});

app.get('/', (req, res) => {
  res.send('Backend API is running');
});

app.use('/api/auth', authRoutes);

app.use('/api/admin/users', authenticate, authorizeRoles('system_admin'), adminUserRoutes);
app.use('/api/admin/stores', authenticate, authorizeRoles('system_admin'), adminStoreRoutes);

app.use('/api/users', authenticate, authorizeRoles('system_admin'), userRoutes);

app.use('/api/stores', authenticate, storeRoutes);
app.use('/api/ratings', authenticate, ratingRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
