const Video = require('../models/Video');

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public (or Protected - depends on your design)
const getVideos = async (req, res) => {
    try {
        const videos = await Video.find().sort({ videoId: 1 });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single video by ID
// @route   GET /api/videos/:id
// @access  Public
const getVideoById = async (req, res) => {
    try {
        const video = await Video.findOne({ videoId: parseInt(req.params.id) });

        if (video) {
            res.json(video);
        } else {
            res.status(404).json({ message: 'الفيديو غير موجود' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new video
// @route   POST /api/videos
// @access  Private (Instructor only)
const createVideo = async (req, res) => {
    try {
        const { videoId, title, description, videoUrl, thumbnail, weekNumber, formSchema } = req.body;

        // Check if video already exists
        const videoExists = await Video.findOne({ videoId });
        if (videoExists) {
            return res.status(400).json({ message: 'الفيديو موجود بالفعل' });
        }

        const video = await Video.create({
            videoId,
            title,
            description,
            videoUrl,
            thumbnail,
            weekNumber,
            formSchema
        });

        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private (Instructor only)
const updateVideo = async (req, res) => {
    try {
        const video = await Video.findOne({ videoId: parseInt(req.params.id) });

        if (video) {
            video.title = req.body.title || video.title;
            video.description = req.body.description || video.description;
            video.videoUrl = req.body.videoUrl || video.videoUrl;
            video.thumbnail = req.body.thumbnail || video.thumbnail;
            video.weekNumber = req.body.weekNumber || video.weekNumber;
            video.formSchema = req.body.formSchema || video.formSchema;
            video.updatedAt = Date.now();

            const updatedVideo = await video.save();
            res.json(updatedVideo);
        } else {
            res.status(404).json({ message: 'الفيديو غير موجود' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findOneAndDelete({ videoId: parseInt(req.params.id) });

        if (video) {
            res.json({ message: 'تم حذف الفيديو بنجاح' });
        } else {
            res.status(404).json({ message: 'الفيديو غير موجود' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo,
};
