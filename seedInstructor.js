require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

const seedInstructor = async () => {
    await connectDB();

    try {
        // Check if instructor already exists
        const existingInstructor = await User.findOne({ email: 'instructor@app.com' });

        if (existingInstructor) {
            console.log('ℹ️  Instructor account already exists');
            process.exit(0);
        }

        // Create instructor account
        const instructor = await User.create({
            name: 'المشرف الأكاديمي',
            email: 'instructor@app.com',
            password: 'password123',
            role: 'instructor',
            profile: {
                age: 35,
                gender: 'male',
                state: 'الجزائر',
                branch: 'علم النفس',
            }
        });

        console.log('✅ Instructor account created successfully:');
        console.log('   Email: instructor@app.com');
        console.log('   Password: password123');
        console.log('   Role: instructor');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating instructor:', error.message);
        process.exit(1);
    }
};

seedInstructor();
