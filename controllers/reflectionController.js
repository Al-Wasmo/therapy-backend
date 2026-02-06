const VideoReflection = require('../models/VideoReflection');
const Video = require('../models/Video');

// @desc    Submit or update video reflection
// @route   POST /api/reflections
// @access  Private
const submitReflection = async (req, res) => {
    try {
        const { videoId, responses } = req.body;

        if (!videoId || !responses) {
            return res.status(400).json({ message: 'معرف الفيديو والإجابات مطلوبة' });
        }

        // Get video title for caching
        const video = await Video.findOne({ videoId });
        const videoTitle = video ? video.title : '';

        // Check if reflection already exists for this user + video
        let reflection = await VideoReflection.findOne({
            user: req.user._id,
            videoId
        });

        if (reflection) {
            // Update existing reflection
            reflection.responses = responses;
            reflection.videoTitle = videoTitle;
            reflection.updatedAt = Date.now();
            await reflection.save();

            res.json(reflection);
        } else {
            // Create new reflection
            reflection = await VideoReflection.create({
                user: req.user._id,
                videoId,
                videoTitle,
                responses
            });

            res.status(201).json(reflection);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user's reflections
// @route   GET /api/reflections
// @access  Private
const getUserReflections = async (req, res) => {
    try {
        const { videoId } = req.query;

        const filter = { user: req.user._id };
        if (videoId) {
            filter.videoId = parseInt(videoId);
        }

        const reflections = await VideoReflection.find(filter)
            .sort({ submittedAt: -1 });

        res.json(reflections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's reflection for specific video
// @route   GET /api/reflections/:videoId
// @access  Private
const getReflectionByVideo = async (req, res) => {
    try {
        const reflection = await VideoReflection.findOne({
            user: req.user._id,
            videoId: parseInt(req.params.videoId)
        });

        if (reflection) {
            res.json(reflection);
        } else {
            res.status(404).json({ message: 'لم يتم العثور على إجابة لهذا الفيديو' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all student reflections (Instructor only)
// @route   GET /api/reflections/all
// @access  Private (Instructor)
const getAllReflections = async (req, res) => {
    try {
        const { videoId, userId } = req.query;

        const filter = {};
        if (videoId) filter.videoId = parseInt(videoId);
        if (userId) filter.user = userId;

        const reflections = await VideoReflection.find(filter)
            .populate('user', 'name email role profile')
            .sort({ submittedAt: -1 });

        res.json(reflections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitReflection,
    getUserReflections,
    getReflectionByVideo,
    getAllReflections,
};
