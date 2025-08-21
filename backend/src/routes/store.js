import express from 'express';

const router = express.Router();

// Get all stores with average ratings
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT s.id, s.name, s.address,
        COALESCE(AVG(r.rating), 0) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
      ORDER BY s.name;
    `;
    const { rows } = await req.pgPool.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get store by ID with average rating
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT s.id, s.name, s.address,
        COALESCE(AVG(r.rating), 0) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = $1
      GROUP BY s.id;
    `;
    const { rows } = await req.pgPool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
