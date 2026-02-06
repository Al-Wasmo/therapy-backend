const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'instructor'], default: 'student' },

    // Profile Data (Embedded Object matching Register.jsx)
    profile: {
        age: Number,
        gender: String, // male, female
        state: String,
        branch: String,
        educationType: String, // regular, free

        // Health
        chronicDiseases: String,
        medications: String,

        // Study Habits
        goodSubjects: String,
        difficultSubjects: String,
        studyHours: Number,
        revisionStyle: String, // detailed, fast, group
        preferredTime: String, // morning, evening, mixed
        prepMethod: String, // reading, videos, summaries, exercises

        // Psychological
        anxietyLevel: [Number], // Array to track history
        stressLevel: String, // low, medium, high
        motivationLevel: String, // low, medium, high
        reactionToPressure: String,
        copingSkills: String,
        previousTherapy: String, // yes, no

        // Needs (Checkbox Mappings)
        needs: {
            timeMgmt: Boolean,
            anxietyMgmt: Boolean,
            focus: Boolean,
            support: Boolean,
            reviewTech: Boolean
        }
    },
    createdAt: { type: Date, default: Date.now }
});


// Method to compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
