import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../../models/user.js'; // Adjust path as needed

const router = express.Router();

// @TODO: Move JWT_SECRET to environment variables
const JWT_SECRET = 'your_jwt_secret_key_placeholder'; // Replace with a strong secret

// @route   POST api/auth/register/collaborator
// @desc    Register collaborator user
// @access  Public
router.post(
  '/register/collaborator',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    body('contactNumber', 'Contact number is required').not().isEmpty(),
    body('skills', 'Skills are required').isArray().notEmpty(),
    body('bio', 'Bio is required').not().isEmpty(),
    body('portfolioLinks', 'Portfolio links must be an array of URLs').optional().isArray().custom(value => {
      if (value.some(link => !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(link))) {
        throw new Error('Invalid portfolio link format');
      }
      return true;
    }),
    // Photo is optional, no server-side validation needed for file upload itself
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, contactNumber, skills, portfolioLinks, bio, photo } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        email,
        password,
        contactNumber,
        skills,
        portfolioLinks,
        bio,
        photo, // Assuming photo is a URL or identifier after upload
        role: 'collaborator',
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
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