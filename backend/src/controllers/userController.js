import pool from '../models/db.js';

export const getAllUsers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, email, address, role FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
