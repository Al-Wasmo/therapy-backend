const express = require('express');
const router = express.Router();
const {
    getVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo,
} = require('../controllers/videoController');
const { protect, requireRole } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       properties:
 *         videoId:
 *           type: number
 *           description: Unique video identifier
 *         title:
 *           type: string
 *           description: Video title
 *         description:
 *           type: string
 *           description: Video description
 *         videoUrl:
 *           type: string
 *           description: Video embed URL
 *         thumbnail:
 *           type: string
 *           description: Thumbnail image URL
 *         weekNumber:
 *           type: number
 *           description: Week number in program
 *         formSchema:
 *           type: array
 *           description: Dynamic form fields
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [text, textarea, scale, radio]
 *               label:
 *                 type: string
 */

/**
 * @swagger
 * /api/videos:
 *   get:
 *     summary: Get all videos
 *     tags: [Videos]
 *     responses:
 *       200:
 *         description: List of all videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
 *   post:
 *     summary: Create new video (Instructor only)
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Video'
 *     responses:
 *       201:
 *         description: Video created successfully
 *       400:
 *         description: Video already exists
 *       403:
 *         description: Access denied
 */
router.get('/', getVideos);
router.post('/', protect, requireRole('instructor'), createVideo);

/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: Get video by ID
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Video details
 *       404:
 *         description: Video not found
 *   put:
 *     summary: Update video (Instructor only)
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Video'
 *     responses:
 *       200:
 *         description: Video updated successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Video not found
 */
router.get('/:id', getVideoById);
router.put('/:id', protect, requireRole('instructor'), updateVideo);
router.delete('/:id', protect, requireRole('instructor'), deleteVideo);

module.exports = router;
