import express from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate, authorizeRoles('system_admin'));

router.get('/', async (req, res) => {
  try {
    const usersCount = await req.pgPool.query('SELECT COUNT(*) FROM users');
    const storesCount = await req.pgPool.query('SELECT COUNT(*) FROM stores');
    const ratingsCount = await req.pgPool.query('SELECT COUNT(*) FROM ratings');

    res.json({
      totalUsers: parseInt(usersCount.rows[0].count, 10),
      totalStores: parseInt(storesCount.rows[0].count, 10),
      totalRatings: parseInt(ratingsCount.rows[0].count, 10),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;