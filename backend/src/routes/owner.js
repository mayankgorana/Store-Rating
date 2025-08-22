import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();
router.use(authenticate, authorizeRoles("store_owner"));

router.get("/dashboard", async (req, res) => {
  const ownerId = req.user.id;
  const pool = req.pgPool;

  try {
    console.log("Owner ID:", ownerId);

    const storeRes = await pool.query(
      "SELECT * FROM stores WHERE owner_id = $1",
      [ownerId]
    );
    console.log("Store result:", storeRes.rows);

    if (!storeRes.rows.length) {
      return res.json({ store: null, ratings: [], averageRating: null });
    }

    const store = storeRes.rows[0];

    const ratingsRes = await pool.query(
      `SELECT r.id, r.rating, u.name as username
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id=$1
       ORDER BY r.id DESC`,
      [store.id]
    );

    const avgRatingRes = await pool.query(
      "SELECT AVG(rating) AS avg_rating FROM ratings WHERE store_id = $1",
      [store.id]
    );

    res.json({
      store,
      ratings: ratingsRes.rows,
      averageRating: avgRatingRes.rows[0].avg_rating
        ? Number(avgRatingRes.rows[0].avg_rating)
        : null,
    });
  } catch (err) {
    console.error("Error in /owner/dashboard:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
