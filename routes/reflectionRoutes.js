const express = require('express');
const router = express.Router();
const {
    submitReflection,
    getUserReflections,
    getReflectionByVideo,
    getAllReflections,
} = require('../controllers/reflectionController');
const { protect, requireRole } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     VideoReflection:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Reflection ID
 *         user:
 *           type: string
 *           description: User ID
 *         videoId:
 *           type: number
 *           description: Video ID
 *         videoTitle:
 *           type: string
 *           description: Cached video title
 *         responses:
 *           type: object
 *           description: User responses (dynamic key-value pairs)
 *           example:
 *             q_mood_before: "7"
 *             q_key_takeaway: "Understanding anxiety triggers"
 *             q_apply: "Practice breathing exercises"
 *         submittedAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/reflections:
 *   post:
 *     summary: Submit or update video reflection
 *     tags: [Reflections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - videoId
 *               - responses
 *             properties:
 *               videoId:
 *                 type: number
 *                 example: 1
 *               responses:
 *                 type: object
 *                 example:
 *                   q_mood_before: "7"
 *                   q_key_takeaway: "Understanding anxiety"
 *     responses:
 *       201:
 *         description: Reflection submitted successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get current user's reflections
 *     tags: [Reflections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: videoId
 *         schema:
 *           type: number
 *         description: Filter by video ID (optional)
 *     responses:
 *       200:
 *         description: User's reflections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VideoReflection'
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, submitReflection);
router.get('/', protect, getUserReflections);

/**
 * @swagger
 * /api/reflections/all:
 *   get:
 *     summary: Get all student reflections (Instructor only)
 *     tags: [Reflections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: videoId
 *         schema:
 *           type: number
 *         description: Filter by video ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: All reflections with populated user data
 *       403:
 *         description: Access denied
 */
router.get('/all', protect, requireRole('instructor'), getAllReflections);

/**
 * @swagger
 * /api/reflections/{videoId}:
 *   get:
 *     summary: Get user's reflection for specific video
 *     tags: [Reflections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: User's reflection for this video
 *       404:
 *         description: No reflection found
 *       401:
 *         description: Unauthorized
 */
router.get('/:videoId', protect, getReflectionByVideo);

module.exports = router;
