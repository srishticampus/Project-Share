import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../../models/user.js'; // Adjust path as needed

const router = express.Router();

// @TODO: Move JWT_SECRET to environment variables
const JWT_SECRET = 'your_jwt_secret_key_placeholder'; // Replace with a strong secret

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
          role: user.role, // Include role for RBAC
        },
      };

      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: 3600 }, // Expires in 1 hour (adjust as needed)
        (err, token) => {
          if (err) throw err;
          // Update lastLogin
          user.lastLogin = Date.now();
          user.save(); // Don't await this, let it run in background
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

export default router;