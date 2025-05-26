import express from 'express';
import auth from '../../middleware/auth.js';
import Article from '../../models/Article.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   POST api/mentor/articles
// @desc    Create a new article
// @access  Private (Mentor only)
router.post(
  '/articles',
  auth,
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
router.get('/articles', auth, async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user.id }).sort({ publicationDate: -1 });
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
router.get('/articles/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }

    // Ensure the article belongs to the logged-in mentor
    if (article.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
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
  auth,
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
router.delete('/articles/:id', auth, async (req, res) => {
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

export default router;
