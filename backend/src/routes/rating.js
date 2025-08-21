import express from 'express';

const router = express.Router();

// Get all ratings (could be restricted to admin)
router.get('/', async (req, res) => {
  try {
    const { rows } = await req.pgPool.query('SELECT * FROM ratings');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit or update a rating
router.post('/', async (req, res) => {
  const { user_id, store_id, rating } = req.body;

  if (!user_id || !store_id || !rating) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if rating exists
    const existing = await req.pgPool.query(
      'SELECT * FROM ratings WHERE user_id=$1 AND store_id=$2',
      [user_id, store_id]
    );

    if (existing.rows.length > 0) {
      // Update existing rating
      await req.pgPool.query(
        'UPDATE ratings SET rating=$1, submitted_at=NOW() WHERE user_id=$2 AND store_id=$3',
        [rating, user_id, store_id]
      );
      return res.json({ message: 'Rating updated' });
    }

    // Insert new rating
    await req.pgPool.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3)',
      [user_id, store_id, rating]
    );

    res.json({ message: 'Rating submitted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
