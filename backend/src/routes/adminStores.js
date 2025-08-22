import express from "express";
import bcrypt from "bcryptjs";

const router = express.Router();

// Get all stores with owner info and average rating
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        s.id, 
        s.name, 
        s.email, 
        s.address, 
        s.owner_id,
        u.name AS owner_name,
        u.email AS owner_email,
        COALESCE(AVG(r.rating), 0) AS avg_rating
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id, u.name, u.email
      ORDER BY s.id ASC;
    `;
    const { rows } = await req.pgPool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch stores with ratings:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create store + owner user
router.post('/', async (req, res) => {
  const { name, email, address, password } = req.body;
  const pool = req.pgPool;

  try {
    // 1. Create store owner user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRes = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, hashedPassword, 'store_owner']
    );
    const ownerId = userRes.rows[0].id;

    // 2. Create store
    const storeRes = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address, ownerId]
    );

    res.status(201).json(storeRes.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update store (doesn't touch password/user)
router.put("/:id", async (req, res) => {
  const pool = req.pgPool;
  const { name, email, address } = req.body;
  try {
    const result = await pool.query(
      `UPDATE stores SET name=$1, email=$2, address=$3 WHERE id=$4 RETURNING *`,
      [name, email, address, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update store" });
  }
});

// Delete store (also deletes user automatically if you set ON DELETE CASCADE)
router.delete("/:id", async (req, res) => {
  const pool = req.pgPool;
  try {
    await pool.query("DELETE FROM stores WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete store" });
  }
});

export default router;
