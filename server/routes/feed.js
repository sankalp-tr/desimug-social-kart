const express = require('express');
const router = express.Router();
const WallPost = require('../models/WallPost');

/**
 * @swagger
 * /api/feed:
 *   get:
 *     summary: List all wall posts, newest first
 *     tags: [Feed]
 *     responses:
 *       200:
 *         description: Array of wall posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/WallPost' }
 */
router.get('/', async (req, res) => {
  try {
    const posts = await WallPost.find()
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/feed/user/{userId}:
 *   get:
 *     summary: List wall posts by a specific user
 *     tags: [Feed]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Array of wall posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/WallPost' }
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await WallPost.find({ author: req.params.userId })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/feed/{id}:
 *   get:
 *     summary: Get a single wall post by ID
 *     tags: [Feed]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: The wall post
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/WallPost' }
 *       404:
 *         description: Post not found
 */
router.get('/:id', async (req, res) => {
  try {
    const post = await WallPost.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/feed:
 *   post:
 *     summary: Create a new wall post
 *     tags: [Feed]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [author, content]
 *             properties:
 *               author: { type: string, description: 'User ID of the author' }
 *               content: { type: string }
 *               imageUrl: { type: string }
 *               tags: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Post created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/WallPost' }
 *       400:
 *         description: Validation error
 */
router.post('/', async (req, res) => {
  try {
    const { author, content, imageUrl, tags } = req.body;
    const post = await WallPost.create({ author, content, imageUrl, tags });
    await post.populate('author', 'name avatar');
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/feed/{id}/like:
 *   post:
 *     summary: Toggle a like on a post for a given user
 *     tags: [Feed]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId: { type: string }
 *     responses:
 *       200:
 *         description: Updated like count and whether this user now likes it
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likes: { type: number }
 *                 liked: { type: boolean }
 *       404:
 *         description: Post not found
 */
router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await WallPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/feed/{id}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Feed]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, text]
 *             properties:
 *               userId: { type: string }
 *               text: { type: string }
 *     responses:
 *       201:
 *         description: Updated comment list for the post
 *       404:
 *         description: Post not found
 */
router.post('/:id/comments', async (req, res) => {
  try {
    const { userId, text } = req.body;
    const post = await WallPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: userId, text });
    await post.save();
    await post.populate('comments.user', 'name avatar');
    res.status(201).json(post.comments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/feed/{id}:
 *   delete:
 *     summary: Delete a wall post
 *     tags: [Feed]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Post deleted
 *       404:
 *         description: Post not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const post = await WallPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
