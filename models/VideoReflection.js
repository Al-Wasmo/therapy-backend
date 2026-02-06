const mongoose = require('mongoose');

const VideoReflectionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    videoId: { type: Number, required: true },
    videoTitle: String, // Cached for convenience

    // Flexible responses object (matches formSchema field IDs)
    // Using Map to store dynamic key-value pairs
    responses: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },

    submittedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Compound index: one reflection per user per video
VideoReflectionSchema.index({ user: 1, videoId: 1 }, { unique: true });

module.exports = mongoose.model('VideoReflection', VideoReflectionSchema);
