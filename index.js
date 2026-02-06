require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/messages', require('./routes/chatRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/reflections', require('./routes/reflectionRoutes'));

// Swagger Documentation
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
//     customCss: '.swagger-ui .topbar { display: none }',
//     customSiteTitle: 'Therapy App API Docs'
// }));

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Therapy App API',
        docs: 'http://localhost:5000/api-docs'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Docs available at http://localhost:${PORT}/api-docs`);
});
