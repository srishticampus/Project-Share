import express from 'express';
import { protect } from '../../middleware/auth.js';
import Article from '../../models/Article.js';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
const JWT_SECRET = 'your_jwt_secret_key_placeholder'; // Must match the one in auth controller

const router = express.Router();

// @route   POST api/mentor/articles
// @desc    Create a new article
// @access  Private (Mentor only)
router.post(
  '/articles',
  protect,
  [
    body('title', 'Title is required').not().isEmpty(),
    body('content', 'Content is required').not().isEmpty(),
    body('category', 'Category is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category, tags } = req.body;

    try {
      const newArticle = new Article({
        title,
        content,
        author: req.user.id, // The logged-in mentor is the author
        category,
        tags: Array.isArray(tags) ? tags : [],
      });

      const article = await newArticle.save();
      res.json(article);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/mentor/articles
// @desc    Get all articles by the logged-in mentor
// @access  Private (Mentor only)
router.get('/articles', async (req, res) => {
  try {
    let userId = req.body.userId;
    if(!userId){
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.user.id;
    }
    const articles = await Article.find({ author: userId }).sort({ publicationDate: -1 });
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/mentor/articles/:id
// @desc    Get a single article by ID
// @access  Private (Mentor only, or public if articles are generally viewable)
// For now, assuming private for mentor's own articles
router.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }

    res.json(article);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Article not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/mentor/articles/:id
// @desc    Update an article
// @access  Private (Mentor only)
router.put(
  '/articles/:id',
  protect,
  [
    body('title', 'Title is required').not().isEmpty(),
    body('content', 'Content is required').not().isEmpty(),
    body('category', 'Category is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category, tags } = req.body;

    try {
      let article = await Article.findById(req.params.id);

      if (!article) {
        return res.status(404).json({ msg: 'Article not found' });
      }

      // Ensure user owns the article
      if (article.author.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      article.title = title;
      article.content = content;
      article.category = category;
      article.tags = Array.isArray(tags) ? tags : [];

      await article.save();
      res.json(article);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Article not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/mentor/articles/:id
// @desc    Delete an article
// @access  Private (Mentor only)
router.delete('/articles/:id', protect, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }

    // Ensure user owns the article
    if (article.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await article.deleteOne(); // Use deleteOne() instead of remove()
    res.json({ msg: 'Article removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Article not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/mentor/articles/by-mentor/:mentorId
// @desc    Get all articles by a specific mentor ID
// @access  Private (Accessible by any authenticated user)
router.get('/articles/by-mentor/:mentorId', protect, async (req, res) => {
  try {
    const articles = await Article.find({ author: req.params.mentorId }).sort({ publicationDate: -1 });
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Mentor not found or invalid ID' });
    }
    res.status(500).send('Server error');
  }
});

export default router;
