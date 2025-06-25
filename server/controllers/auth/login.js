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

      // Check if the user is the admin user
      const isAdmin = email === 'admin@admin.com' && password === 'admin';

      if (isAdmin && !user) {
        // Create the admin user if it doesn't exist
        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
          name: 'Admin', // Set the name to "Admin"
          email,
          password: hashedPassword,
          role: 'admin',
        });

        await user.save();
      }

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Check if the user is not an admin and not approved
      if (user.role !== 'admin' && !user.isApproved) {
        return res.status(403).json({ errors: [{ msg: 'Your account is pending admin approval.' }] });
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
          isAdmin: isAdmin,
        },
      };

      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: 60*60*24*7 }, // Expires in 1 week (adjust as needed)
        (err, token) => {
          if (err) throw err;
          // Update lastLogin and increment loginCount
          user.lastLogin = Date.now();
          user.loginCount = (user.loginCount || 0) + 1; // Increment login count
          user.save(); // Don't await this, let it run in background
          res.json({ token, isAdmin: isAdmin, role: user.role });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

export default router;
