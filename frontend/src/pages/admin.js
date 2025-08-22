import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();
router.use(authenticate, authorizeRoles("system_admin"));

// Admin Stats (Users, Stores, Ratings count)
router.get("/stats", async (req, res) => {
  try {
    const users = await req.pgPool.query("SELECT COUNT(*) FROM users");
    const stores = await req.pgPool.query("SELECT COUNT(*) FROM stores");
    const ratings = await req.pgPool.query("SELECT COUNT(*) FROM ratings");

    res.json({
      users: parseInt(users.rows[0].count, 10),
      stores: parseInt(stores.rows[0].count, 10),
      ratings: parseInt(ratings.rows[0].count, 10),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;