import express from 'express';
import bcrypt from 'bcryptjs';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate, authorizeRoles('system_admin'));

// Get all users
router.get('/', async (req, res) => {
  try {
    const { rows } = await req.pgPool.query(
      'SELECT id, name, email, address, role FROM users ORDER BY id ASC'
    );
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
    if (!result.rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    // Check if email exists
    const existing = await req.pgPool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rows.length) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await req.pgPool.query(
      'INSERT INTO users (name, email, password_hash, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role',
      [name, email, hashedPassword, address, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, address, role } = req.body;

  try {
    const result = await req.pgPool.query(
      'UPDATE users SET name=$1, email=$2, address=$3, role=$4 WHERE id=$5 RETURNING id, name, email, address, role',
      [name, email, address, role, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await req.pgPool.query('DELETE FROM users WHERE id=$1 RETURNING id', [id]);
    if (!result.rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
