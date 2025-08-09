const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./db/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import routes
const userRoutes = require("./routes/userRoute");
const adminRoutes = require("./routes/adminRoute");
const paymentRoutes = require("./routes/paymentRoute");
const cartRoutes = require("./routes/cartRoute");
const plansRoutes = require("./routes/plansRoute");
const chatbotRoutes = require("./routes/chatbotRoute");

dotenv.config();

connectDB();

app.use(express.json());

// CORS configuration for credentials
const allowedOrigins = [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:3000',  // React dev server
    'http://127.0.0.1:5174', // Alternative localhost
    'http://127.0.0.1:3000',
    'http://localhost:5174',
    `${process.env.FRONTEND_URL}`, // Production frontend URL
    //   // Alternative localhost
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie']
}));

// Handle preflight requests
app.options('*', cors());

app.use(cookieParser());

// Mount routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/plans", plansRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Global error handling middleware
app.use((error, req, res, next) => {
    console.error('❌ Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.listen(process.env.PORT, () => {
    // Server started successfully
    console.log("server started ")
});