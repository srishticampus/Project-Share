import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import User from '../../models/user.js';
import sendEmail from '../../services/emailService.js';

const router = express.Router();

// @route   POST api/auth/forgot-password
// @desc    Request password reset link
// @access  Public
router.post(
  '/forgot-password',
  [body('email', 'Please include a valid email').isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        // Return generic success message to prevent email enumeration
        return res.json({ msg: 'If a user with that email exists, a password reset link has been sent.' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(20).toString('hex');

      // Set token and expiry on user model
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 hour

      await user.save();

      // Create reset URL
      const resetUrl = `${process.env.FRONTEND_URL}reset-password?token=${resetToken}`;

      const message = `
        You are receiving this because you (or someone else) has requested the reset of a password.
        Please make a PUT request to: \n\n ${resetUrl}
        \n\n If you did not request this, please ignore this email and your password will remain unchanged.
      `;

      try {
        await sendEmail({
          email: user.email,
          subject: 'Password Reset Request',
          message,
        });

        res.json({ msg: 'If a user with that email exists, a password reset link has been sent.' });
      } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return res.status(500).json({ msg: 'Email could not be sent' });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.post(
  '/reset-password/:token',
  [
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.params;
    const { password } = req.body;

    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid or expired token' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      res.json({ msg: 'Password updated successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

export default router;
