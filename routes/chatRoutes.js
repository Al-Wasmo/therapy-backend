const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         _id:
 *           type: string
 *           description: Message ID
 *         sender:
 *           type: object
 *           description: Sender information
 *         senderName:
 *           type: string
 *           description: Cached sender name
 *         senderRole:
 *           type: string
 *           description: Sender role (student/instructor)
 *         text:
 *           type: string
 *           description: Message content
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Message timestamp
 */

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all messages
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Send a message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: مرحباً، أحتاج مساعدة في إدارة القلق
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Text is required
 *       401:
 *         description: Unauthorized
 */
router.get('/conversations', protect, require('../controllers/chatController').getConversations);
router.get('/', protect, getMessages);
router.post('/', protect, sendMessage);

module.exports = router;
