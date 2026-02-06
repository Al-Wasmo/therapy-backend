const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    videoId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    videoUrl: String,
    thumbnail: String,
    weekNumber: Number,

    // Dynamic form schema - flexible structure
    formSchema: [{
        id: String,           // e.g., "q_mood_before"
        type: {               // Field type
            type: String,
            enum: ['text', 'textarea', 'scale', 'radio']
        },
        label: String,        // Question text
        placeholder: String,  // For text/textarea
        min: Number,          // For scale
        max: Number,          // For scale
        minLabel: String,     // For scale
        maxLabel: String,     // For scale
        options: [{           // For radio
            value: String,
            label: String
        }]
    }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', VideoSchema);
