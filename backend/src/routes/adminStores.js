import express from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate, authorizeRoles('system_admin'));

// Get all stores
router.get('/', async (req, res) => {
  try {
    const { rows } = await req.pgPool.query('SELECT * FROM stores ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get store by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await req.pgPool.query('SELECT * FROM stores WHERE id=$1', [id]);
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new store
router.post('/', async (req, res) => {
  const { name, email, address, owner_id } = req.body;

  try {
    const result = await req.pgPool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address, owner_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update store by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, address, owner_id } = req.body;

  try {
    const result = await req.pgPool.query(
      'UPDATE stores SET name=$1, email=$2, address=$3, owner_id=$4 WHERE id=$5 RETURNING *',
      [name, email, address, owner_id, id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete store by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await req.pgPool.query('DELETE FROM stores WHERE id=$1 RETURNING id', [id]);
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json({ message: 'Store deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
