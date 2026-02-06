const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get messages for current user
// @route   GET /api/messages
// @access  Private
const getMessages = async (req, res) => {
    try {
        const { userId } = req.query; // For instructor viewing a specific student
        const currentUser = req.user;

        let query = {};

        if (currentUser.role === 'instructor') {
            if (!userId) {
                // If instructor loads chat without selecting user, maybe return empty or general?
                // Or maybe this endpoint isn't used for the list.
                return res.json([]);
            }
            // Instructor viewing chat with specific student
            query = {
                $or: [
                    { sender: currentUser._id, recipient: userId },
                    { sender: userId, recipient: currentUser._id }
                ]
            };
        } else {
            // Student viewing their own chat (with any instructor)
            query = {
                $or: [
                    { sender: currentUser._id },
                    { recipient: currentUser._id }
                ]
            };
        }

        const messages = await Message.find(query)
            .populate('sender', 'name role')
            .populate('recipient', 'name role')
            .sort({ timestamp: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get conversations (unique users) for instructor
// @route   GET /api/messages/conversations
// @access  Private (Instructor)
const getConversations = async (req, res) => {
    try {
        // Find distinct user IDs who have interacted with this instructor
        // or just all students?

        // Let's get all students for now to ensure we can message anyone
        // Using "conversations" implies history, but the requirement is "see user and message them"

        // Let's get all users with role 'student'
        // And maybe attach last message?

        const students = await User.find({ role: 'student' }).select('name email profile');

        // Ideally we would attach "unread count" or "last message"
        // But for MVP, list of students is enough

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { text, recipientId } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'النص مطلوب' });
        }

        let recipient;

        if (req.user.role === 'instructor') {
            // Instructor must specify recipient
            if (!recipientId) {
                return res.status(400).json({ message: 'المستلم مطلوب' });
            }
            recipient = recipientId;
        } else {
            // Student sends to Instructor
            // Find an instructor to receive (first one found)
            const instructor = await User.findOne({ role: 'instructor' });
            if (!instructor) {
                return res.status(404).json({ message: 'لا يوجد مشرف متاح حالياً' });
            }
            recipient = instructor._id;
        }

        const message = await Message.create({
            sender: req.user._id,
            recipient: recipient,
            senderName: req.user.name,
            senderRole: req.user.role,
            text,
        });

        await message.populate('sender', 'name role');
        await message.populate('recipient', 'name role');

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMessages,
    sendMessage,
    getConversations
};
