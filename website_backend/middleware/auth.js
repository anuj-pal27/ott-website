const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = async (req, res, next) => {
    try {
        // Get token from multiple sources
        let token = null;
        
        // Check Authorization header
        if (req.header("Authorization")) {
            token = req.header("Authorization").replace("Bearer ", "");
        }
        // Check cookies
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        // Check body (fallback)
        else if (req.body && req.body.token) {
            token = req.body.token;
        }
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token is required"
            });
        }
        
        // Verify token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        
        // Set user data in request
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token has expired"
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        
        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        // Check if user data exists (auth middleware should have set this)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }
        
        // Check if user is admin
        if (req.user.accountType !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }
        
        next();
    } catch (error) {
        console.error("isAdmin middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Authorization check failed"
        });
    }
};

module.exports = {
    auth,
    isAdmin,
};