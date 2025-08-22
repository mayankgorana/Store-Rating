import express from "express";

const router = express.Router();

// Get total users, stores, ratings
router.get("/stats", async (req, res) => {
  try {
    const client = req.pgPool;

    const users = await client.query("SELECT COUNT(*) AS total FROM users");
    const stores = await client.query("SELECT COUNT(*) AS total FROM stores");
    const ratings = await client.query("SELECT COUNT(*) AS total FROM ratings");

    res.json({
      users: parseInt(users.rows[0].total, 10),
      stores: parseInt(stores.rows[0].total, 10),
      ratings: parseInt(ratings.rows[0].total, 10),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
