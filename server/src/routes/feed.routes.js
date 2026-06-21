const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feed.controller');

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
router.get('/', feedController.getAllPosts);

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
router.get('/user/:userId', feedController.getPostsByUser);

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
router.get('/:id', feedController.getPostById);

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
router.post('/', feedController.createPost);

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
router.post('/:id/like', feedController.toggleLike);

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
router.post('/:id/comments', feedController.addComment);

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
router.delete('/:id', feedController.deletePost);

module.exports = router;
