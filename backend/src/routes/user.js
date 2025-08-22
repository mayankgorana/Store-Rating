  import express from 'express';
  import bcrypt from 'bcryptjs';
  import { authenticate } from '../middlewares/auth.js';
  const router = express.Router();

  // Get all users
  router.get('/', async (req, res) => {
    try {
      const { rows } = await req.pgPool.query('SELECT id, name, email, address, role FROM users');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get user by ID
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await req.pgPool.query('SELECT id, name, email, address, role FROM users WHERE id=$1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  router.post('/change-password', authenticate, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
      const userResult = await req.pgPool.query('SELECT password_hash FROM users WHERE id=$1', [userId]);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const validCurrent = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
      if (!validCurrent) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      const hashedNew = await bcrypt.hash(newPassword, 10);
      await req.pgPool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hashedNew, userId]);
      res.json({ message: 'Password changed successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  export default router;
