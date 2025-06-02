import express from 'express';
import { body, validationResult } from 'express-validator';
import ContactSubmission from '../models/ContactSubmission.js'; // Import the new model

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit a contact form
// @access  Public
router.post(
  '/',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('subject', 'Subject is required').not().isEmpty(),
    body('message', 'Message is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    try {
      const newSubmission = new ContactSubmission({
        name,
        email,
        subject,
        message,
      });

      await newSubmission.save();

      res.status(201).json({ msg: 'Contact form submitted successfully!' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET /api/contact
// @desc    Get all contact form submissions
// @access  Admin (or appropriate role) - for now, public for testing
router.get('/', async (req, res) => {
  try {
    const submissions = await ContactSubmission.find().sort({ submittedAt: -1 });
    res.status(200).json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete a contact form submission
// @access  Admin (or appropriate role) - for now, public for testing
router.delete('/:id', async (req, res) => {
  try {
    const submission = await ContactSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ msg: 'Contact submission not found' });
    }

    await ContactSubmission.deleteOne({ _id: req.params.id }); // Use deleteOne for Mongoose 6+

    res.status(200).json({ msg: 'Contact submission removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
