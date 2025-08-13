const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Simple signup with email and password
const signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "User already exists with this email" 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const userPayload = {
            name,
            email,
            password: hashedPassword,
            phone: phone || null,
            isEmailVerified: true,
            isPhoneVerified: false,
            profilePicture: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`
        };
        
        const userBody = await User.create(userPayload);    
        
        // Automatically log the user in after successful signup
        const payload = {
            userId: userBody._id,
            email: userBody.email,
            accountType: userBody.accountType,
        };

        // Generate token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
        
        // Update user with token
        userBody.token = token;
        await userBody.save();
        
        // Set HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
        });

        // Return user data without sensitive information
        const userResponse = {
            _id: userBody._id,
            name: userBody.name,
            email: userBody.email,
            phone: userBody.phone,
            accountType: userBody.accountType,
            isEmailVerified: userBody.isEmailVerified,
            isPhoneVerified: userBody.isPhoneVerified,
            profilePicture: userBody.profilePicture,
            createdAt: userBody.createdAt
        };
        
        return res.status(200).json({ 
            success: true, 
            message: "Account created successfully and logged in!",
            token, 
            user: userResponse
        });
        
    } catch (error) {
        console.error("❌ Error in signup:", error);
        return res.status(500).json({ 
            success: false, 
            message: "User cannot be registered, please try again" 
        });
    }
};

// Simple login with email and password
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid password" 
            });
        }

        // Create JWT payload
        const payload = {
            userId: user._id,
            email: user.email,
            accountType: user.accountType,
        };

        // Generate token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
        
        // Update user with token
        user.token = token;
        await user.save();

        // Set HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
        });

        // Return user data without sensitive information
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            accountType: user.accountType,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt
        };

        return res.status(200).json({ 
            success: true, 
            message: "Login successful", 
            token, 
            user: userResponse 
        });

    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Login failed, please try again" 
        });
    }
};

// Admin signup with email and password
const createAdmin = async (req, res) => {
    try {
        const { name, email, password, adminSecret, phone } = req.body;
        
        if (!name || !email || !password || !adminSecret) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password, and admin secret are required"
            });
        }
        
        // Verify admin secret key
        if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Invalid admin secret key"
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "User already exists" 
            });
        }
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ accountType: "admin" });
        if (existingAdmin) {
            return res.status(400).json({ 
                success: false, 
                message: "Admin user already exists" 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const adminPayload = {
            name,
            email,
            password: hashedPassword,
            phone: phone || null,
            accountType: "admin",
            isEmailVerified: true,
            isPhoneVerified: false,
            profilePicture: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`
        };
        
        const adminUser = await User.create(adminPayload);     
        
        // Automatically log the admin in after successful signup
        const payload = {
            userId: adminUser._id,
            email: adminUser.email,
            accountType: adminUser.accountType,
        };

        // Generate token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
        
        // Update admin user with token
        adminUser.token = token;
        await adminUser.save();
        
        // Set HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
        });

        // Return admin user data without sensitive information
        const adminResponse = {
            _id: adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            phone: adminUser.phone,
            accountType: adminUser.accountType,
            isEmailVerified: adminUser.isEmailVerified,
            isPhoneVerified: adminUser.isPhoneVerified,
            profilePicture: adminUser.profilePicture,
            createdAt: adminUser.createdAt
        };
        
        return res.status(200).json({ 
            success: true, 
            message: "Admin account created successfully and logged in!",
            token, 
            user: adminResponse
        });
        
    } catch (error) {
        console.error("Error in createAdmin:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Admin user cannot be created, please try again" 
        });
    }
};

// Admin login with email and password
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        
        if (user.accountType !== "admin") {
            return res.status(400).json({
                success: false,
                message: "User is not an admin"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid password" 
            });
        }

        const payload = {
            userId: user._id,
            email: user.email,
            accountType: user.accountType,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
        user.token = token;
        await user.save();
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
        });
        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                accountType: user.accountType,
                isEmailVerified: user.isEmailVerified,
                isPhoneVerified: user.isPhoneVerified,
                profilePicture: user.profilePicture,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error("Error in loginAdmin:", error);
        return res.status(500).json({
            success: false,
            message: "Admin login failed, please try again"
        });
    }
};

// Function to promote existing user to admin (requires admin secret)
const promoteToAdmin = async (req, res) => {
    try {
        const { email, adminSecret } = req.body;
        
        // Verify admin secret key
        if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Invalid admin secret key"
            });
        }
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Check if user is already admin
        if (user.accountType === "admin") {
            return res.status(400).json({
                success: false,
                message: "User is already an admin"
            });
        }
        
        // Promote to admin
        user.accountType = "admin";
        await user.save();
        
        return res.status(200).json({
            success: true,
            message: "User promoted to admin successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                accountType: user.accountType,
                isEmailVerified: user.isEmailVerified,
                isPhoneVerified: user.isPhoneVerified
            }
        });
        
    } catch (error) {
        console.error("Error in promoteToAdmin:", error);
        return res.status(500).json({
            success: false,
            message: "Error promoting user to admin"
        });
    }
};

// Get user details
const getUserDetails = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email }).select('-password -token');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "User details retrieved successfully",
            user
        });
        
    } catch (error) {
        console.error("Error in getUserDetails:", error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving user details"
        });
    }
};

// Update user details
const updateUserDetails = async (req, res) => {
    try {
        const { name, phone, country, profilePicture } = req.body;
        const userId = req.user.userId;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Update fields if provided
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (country) user.country = country;
        if (profilePicture) user.profilePicture = profilePicture;
        
        await user.save();
        
        return res.status(200).json({
            success: true,
            message: "User details updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                country: user.country,
                profilePicture: user.profilePicture,
                accountType: user.accountType,
                isEmailVerified: user.isEmailVerified,
                isPhoneVerified: user.isPhoneVerified,
                createdAt: user.createdAt
            }
        });
        
    } catch (error) {
        console.error("Error in updateUserDetails:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating user details"
        });
    }
};

// Update account type (admin only)
const updateAccountType = async (req, res) => {
    try {
        const { email, accountType, adminSecret } = req.body;
        
        // Verify admin secret key
        if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Invalid admin secret key"
            });
        }
        
        // Validate account type
        if (!['user', 'admin'].includes(accountType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account type. Must be 'user' or 'admin'"
            });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        user.accountType = accountType;
        await user.save();
        
        return res.status(200).json({
            success: true,
            message: "Account type updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                accountType: user.accountType
            }
        });
        
    } catch (error) {
        console.error("Error in updateAccountType:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating account type"
        });
    }
};

// Logout function
const logout = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findOne({ _id: userId });
        
        if (user) {
            user.token = null;
            await user.save();
        }
        
        // Clear cookie
        res.clearCookie("token");
        
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
        
    } catch (error) {
        console.error("Error in logout:", error);
        return res.status(500).json({
            success: false,
            message: "Error during logout"
        });
    }
};

module.exports = {
    signup,
    login,
    createAdmin,
    loginAdmin,
    promoteToAdmin,
    getUserDetails,
    updateUserDetails,
    updateAccountType,
    logout
};