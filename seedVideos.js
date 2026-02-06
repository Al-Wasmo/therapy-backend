require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('./models/Video');

// Video data from frontend
const videosData = [
    {
        id: 1,
        title: "الأسبوع 1: مقدمة في فهم القلق",
        description: "تعرف على آليات القلق ولماذا نشعر به وكيف يؤثر على أدائنا الدراسي.",
        videoUrl: "https://drive.google.com/file/d/1x45h7daH5Ud142WLG2gDAK0VUoCprtu1/preview",
        thumbnail: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=600&auto=format&fit=crop",
        formSchema: [
            {
                id: "q_mood_before",
                type: "scale",
                label: "كيف تشعر الآن قبل مشاهدة الفيديو؟",
                min: 1,
                max: 10,
                minLabel: "توتر شديد",
                maxLabel: "هدوء تام"
            },
            {
                id: "q_key_takeaway",
                type: "text",
                label: "ما هي أهم فكرة تعلمتها من الفيديو؟",
                placeholder: "اكتب إجابتك هنا..."
            },
            {
                id: "q_apply",
                type: "textarea",
                label: "كيف يمكنك تطبيق ما تعلمته في دراستك هذا الأسبوع؟",
                placeholder: "مشاركتك تساعدنا في دعمك..."
            }
        ]
    },
    {
        id: 2,
        title: "الأسبوع 2: تقنيات التنفس والاسترخاء",
        description: "تمارين عملية لتهدئة الأعصاب قبل وأثناء الامتحان.",
        videoUrl: "https://drive.google.com/file/d/1x45h7daH5Ud142WLG2gDAK0VUoCprtu1/preview",
        thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
        formSchema: [
            {
                id: "q_practice",
                type: "radio",
                label: "هل قمت بتجربة تمرين التنفس أثناء الفيديو؟",
                options: [
                    { value: "yes", label: "نعم" },
                    { value: "no", label: "لا" }
                ]
            },
            {
                id: "q_feeling_after",
                type: "text",
                label: "صف شعورك بكلمة واحدة بعد التمرين.",
                placeholder: "مثال: أهدأ، مسترخي..."
            }
        ]
    },
    {
        id: 3,
        title: "الأسبوع 3: إدارة الوقت والتخطيط",
        description: "استراتيجيات عملية لتنظيم وقتك وتحديد الأولويات.",
        videoUrl: "https://drive.google.com/file/d/1x45h7daH5Ud142WLG2gDAK0VUoCprtu1/preview",
        thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
        formSchema: [
            {
                id: "q_practice",
                type: "radio",
                label: "هل قمت بتجربة تمرين التنفس أثناء الفيديو؟",
                options: [
                    { value: "yes", label: "نعم" },
                    { value: "no", label: "لا" }
                ]
            },
            {
                id: "q_feeling_after",
                type: "text",
                label: "صف شعورك بكلمة واحدة بعد التمرين.",
                placeholder: "مثال: أهدأ، مسترخي..."
            }
        ]
    }
];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

const seedVideos = async () => {
    await connectDB();

    try {
        // Clear existing videos
        await Video.deleteMany({});
        console.log('🗑️  Cleared existing videos');

        // Insert videos
        for (const videoData of videosData) {
            await Video.create({
                videoId: videoData.id,
                title: videoData.title,
                description: videoData.description,
                videoUrl: videoData.videoUrl,
                thumbnail: videoData.thumbnail,
                weekNumber: videoData.id,
                formSchema: videoData.formSchema
            });
        }

        console.log(`✅ Successfully seeded ${videosData.length} videos`);
        console.log('Videos:');
        videosData.forEach(v => console.log(`   - ${v.title}`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding videos:', error.message);
        process.exit(1);
    }
};

seedVideos();
