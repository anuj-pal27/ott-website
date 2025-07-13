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

dotenv.config();

connectDB();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Mount routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/plans", plansRoutes);

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
    console.log(`🚀 Server is running on port ${process.env.PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});