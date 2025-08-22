import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Signup route
router.post(
  '/signup',
  [
    body('name')
      .isLength({ min: 20, max: 60 })
      .withMessage('Name must be between 20 and 60 characters'),

    body('email')
      .isEmail()
      .withMessage('Valid email required'),

    body('password')
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be 8–16 characters long')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
      .matches(/[!@#$%^&*]/)
      .withMessage('Password must contain at least one special character (!@#$%^&*)'),

    body('address')
      .optional()
      .isLength({ max: 400 })
      .withMessage('Address must not exceed 400 characters'),

    body('role')
      .optional()
      .isIn(['system_admin', 'store_owner', 'normal_user']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, address, role = 'normal_user' } = req.body;
    const pool = req.pgPool;

    try {
      const userExists = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
      if (userExists.rows.length) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role',
        [name, email, hashedPassword, address, role]
      );

      const user = result.rows[0];
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.FOO_COOKIE_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token, user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);



// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const pool = req.pgPool;
    try {
      const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
      if (!result.rows.length) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.FOO_COOKIE_SECRET, {
        expiresIn: '1h',
      });
      res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
