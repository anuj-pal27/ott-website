const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require('otp-generator');
const { Otp, sendVerificationSms } = require("../models/Otp");
const sendEmailOtp = require("../utils/sendEmailOtp");

// Send OTP for phone verification (for login)
const sendPhoneOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        
        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required"
            });
        }
        
        // Check if user exists
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this phone number"
            });
        }
        
        // Generate unique OTP with retry limit
        let otp;
        let attempts = 0;
        const maxAttempts = 10;
        
        do {
            otp = otpGenerator.generate(6, { 
                upperCaseAlphabets: false, 
                specialChars: false 
            });
            attempts++;
            
            if (attempts >= maxAttempts) {
                return res.status(500).json({
                    success: false,
                    message: "Unable to generate unique OTP. Please try again."
                });
            }
        } while (await Otp.findOne({ otp, phone }));
        
        // Delete any existing OTP for this phone
        await Otp.deleteMany({ phone });
        
        const otpPayload = { phone, otp, type: 'phone' };
        const otpBody = await Otp.create(otpPayload);
        
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully to your phone",
            otp, // Remove this in production
        });
    } catch (error) {
        console.error("Error in sendPhoneOtp:", error);
        return res.status(500).json({
            success: false,
            message: "Error in sending OTP"
        });
    }
};

// Send OTP for signup (phone verification)
const sendSignupOtp = async (req, res) => {
    try {
        const { phone, email, name } = req.body;
        
        if (!phone || !email || !name) {
            return res.status(400).json({
                success: false,
                message: "Phone number, email, and name are required"
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ phone }, { email }] 
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this phone number or email"
            });
        }
        
        // Generate unique OTP with retry limit
        let otp;
        let attempts = 0;
        const maxAttempts = 10;
        
        do {
            otp = otpGenerator.generate(6, { 
                upperCaseAlphabets: false, 
                specialChars: false 
            });
            attempts++;
            
            if (attempts >= maxAttempts) {
                return res.status(500).json({
                    success: false,
                    message: "Unable to generate unique OTP. Please try again."
                });
            }
        } while (await Otp.findOne({ otp, phone }));
        
        // Delete any existing OTP for this phone
        await Otp.deleteMany({ phone });
        
        const otpPayload = { phone, otp, type: 'phone' };
        const otpBody = await Otp.create(otpPayload);
        
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully to your phone",
            otp, // Remove this in production
        });
    } catch (error) {
        console.error("Error in sendSignupOtp:", error);
        return res.status(500).json({
            success: false,
            message: "Error in sending OTP"
        });
    }
};

// Send OTP for admin signup (phone verification)
const sendAdminSignupOtp = async (req, res) => {
    try {
        const { phone, email, name, adminSecret } = req.body;
        
        if (!phone || !email || !name || !adminSecret) {
            return res.status(400).json({
                success: false,
                message: "Phone number, email, name, and admin secret are required"
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
        const existingUser = await User.findOne({ 
            $or: [{ phone }, { email }] 
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this phone number or email"
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
        
        // Generate unique OTP with retry limit
        let otp;
        let attempts = 0;
        const maxAttempts = 10;
        
        do {
            otp = otpGenerator.generate(6, { 
                upperCaseAlphabets: false, 
                specialChars: false 
            });
            attempts++;
            
            if (attempts >= maxAttempts) {
                return res.status(500).json({
                    success: false,
                    message: "Unable to generate unique OTP. Please try again."
                });
            }
        } while (await Otp.findOne({ otp, phone }));
        
        // Delete any existing OTP for this phone
        await Otp.deleteMany({ phone });
        
        const otpPayload = { phone, otp, type: 'phone' };
        const otpBody = await Otp.create(otpPayload);
        
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully to your phone",
            otp, // Remove this in production
        });
    } catch (error) {
        console.error("Error in sendAdminSignupOtp:", error);
        return res.status(500).json({
            success: false,
            message: "Error in sending OTP"
        });
    }
};

// Send OTP for admin login (phone verification)
const sendAdminLoginOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        
        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required"
            });
        }
        
        // Check if user exists and is admin
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this phone number"
            });
        }
        
        if (user.accountType !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied: User is not an admin"
            });
        }
        
        // Generate unique OTP with retry limit
        let otp;
        let attempts = 0;
        const maxAttempts = 10;
        
        do {
            otp = otpGenerator.generate(6, { 
                upperCaseAlphabets: false, 
                specialChars: false 
            });
            attempts++;
            
            if (attempts >= maxAttempts) {
                return res.status(500).json({
                    success: false,
                    message: "Unable to generate unique OTP. Please try again."
                });
            }
        } while (await Otp.findOne({ otp, phone }));
        
        // Delete any existing OTP for this phone
        await Otp.deleteMany({ phone });
        
        const otpPayload = { phone, otp, type: 'phone' };
        const otpBody = await Otp.create(otpPayload);
        
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully to your phone",
            otp, // Remove this in production
        });
    } catch (error) {
        console.error("Error in sendAdminLoginOtp:", error);
        return res.status(500).json({
            success: false,
            message: "Error in sending OTP"
        });
    }
};

// Legacy email OTP function (keeping for backward compatibility)
const sendOtp = async (req,res) =>{
    try{
        const {email} = req.body;
         
        // Check for recent OTP requests (rate limiting)
        const checkUserPresent = await User.findOne({email});
        if (checkUserPresent) {
            return res.status(429).json({
                success: false,
                message: "User already exists"
            });
        }
        
        // Generate unique OTP with retry limit
        let otp;
        let attempts = 0;
        const maxAttempts = 10;
        
        do {
            otp = otpGenerator.generate(6, { 
                upperCaseAlphabets: false, 
                specialChars: false 
            });
            attempts++;
            
            if (attempts >= maxAttempts) {
                return res.status(500).json({
                    success: false,
                    message: "Unable to generate unique OTP. Please try again."
                });
            }
        } while (await Otp.findOne({ otp }));
        
        const otpPayload = {email, otp, type: 'email'};
        const otpBody = await Otp.create(otpPayload);
        
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email",
            otp,
        });
    } catch(error){
        console.error("Error in sendOtp:", error);
        return res.status(500).json({
            success: false,
            message: "Error in sending OTP"
        });
    }
}

const signup = async (req, res) => {
    try {
        const { name, email, phone, otp } = req.body;
        
        if (!name || !email || !phone || !otp) {
            return res.status(400).json({
                success: false,
                message: "Name, email, phone, and OTP are required"
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { phone }] 
        });
        if (existingUser) {
            console.log("❌ User already exists:", email);
            return res.status(400).json({ 
                success: false, 
                message: "User already exists" 
            });
        }

        // Verify OTP
        const recentOtp = await Otp.findOne({ phone, type: 'phone' }).sort({createdAt:-1}).limit(1);
        
        if (!recentOtp) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        } else if (otp !== recentOtp.otp.toString()) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        
        // Check if OTP has expired (5 minutes)
        const otpAge = Date.now() - recentOtp.createdAt.getTime();
        const otpExpiryTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        
        if (otpAge > otpExpiryTime) {
            // Delete expired OTP
            await Otp.deleteOne({ _id: recentOtp._id });
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }
        
        // Create user (phone verified)
        const userPayload = {
            name,
            email,
            phone,
            isPhoneVerified: true,
            isEmailVerified: false,
            profilePicture: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`
        };
        
        const userBody = await User.create(userPayload);    
        console.log("✅ User created successfully:", userBody._id);
        
        // Automatically log the user in after successful signup
        const payload = {
            userId: userBody._id,
            phone: userBody.phone,
            accountType: userBody.accountType,
        };

        // Generate token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
        
        // Update user with token
        userBody.token = token;
        await userBody.save();
        
        // Delete the used OTP only after successful user creation and authentication
        await Otp.deleteOne({ _id: recentOtp._id });
        
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

const login = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: "Phone number and OTP are required"
            });
        }

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Check if phone is verified
        if (!user.isPhoneVerified) {
            return res.status(400).json({ 
                success: false, 
                message: "Please verify your phone number before logging in" 
            });
        }
        
        // Verify OTP
        const recentOtp = await Otp.findOne({ phone, type: 'phone' }).sort({createdAt:-1}).limit(1);
        
        if (!recentOtp) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        } else if (otp !== recentOtp.otp.toString()) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        
        // Check if OTP has expired (5 minutes)
        const otpAge = Date.now() - recentOtp.createdAt.getTime();
        const otpExpiryTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        
        if (otpAge > otpExpiryTime) {
            // Delete expired OTP
            await Otp.deleteOne({ _id: recentOtp._id });
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }

        // Create JWT payload
        const payload = {
            userId: user._id,
            phone: user.phone,
            accountType: user.accountType,
        };

        // Generate token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
        
        // Update user with token
        user.token = token;
        await user.save();
        
        // Delete the used OTP only after successful authentication
        await Otp.deleteOne({ _id: recentOtp._id });

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

// Secure admin creation function - requires special secret key and OTP
const createAdmin = async (req, res) => {
    try {
        const { name, email, phone, adminSecret, otp } = req.body;
        
        if (!name || !email || !phone || !adminSecret || !otp) {
            return res.status(400).json({
                success: false,
                message: "Name, email, phone, admin secret, and OTP are required"
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
        const existingUser = await User.findOne({ 
            $or: [{ phone }, { email }] 
        });
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
        
        // Verify OTP
        const recentOtp = await Otp.findOne({ phone, type: 'phone' }).sort({createdAt:-1}).limit(1);
        
        if (!recentOtp) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        } else if (otp !== recentOtp.otp.toString()) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        
        // Check if OTP has expired (5 minutes)
        const otpAge = Date.now() - recentOtp.createdAt.getTime();
        const otpExpiryTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        
        if (otpAge > otpExpiryTime) {
            // Delete expired OTP
            await Otp.deleteOne({ _id: recentOtp._id });
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }

        const adminPayload = {
            name,
            email,
            phone,
            accountType: "admin",
            isPhoneVerified: true,
            isEmailVerified: false,
            profilePicture: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`
        };
        
        const adminUser = await User.create(adminPayload);    
        console.log("Admin user created successfully:", adminUser._id);     
        
        // Automatically log the admin in after successful signup
        const payload = {
            userId: adminUser._id,
            phone: adminUser.phone,
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
        
        // Delete the used OTP only after successful admin creation and authentication
        await Otp.deleteOne({ _id: recentOtp._id });
        
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

const loginAdmin = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        
        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: "Phone number and OTP are required"
            });
        }
        
        const user = await User.findOne({ phone });
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
        
        // Check if phone is verified
        if (!user.isPhoneVerified) {
            return res.status(400).json({ 
                success: false, 
                message: "Please verify your phone number before logging in" 
            });
        }
        
        // Verify OTP
        const recentOtp = await Otp.findOne({ phone, type: 'phone' }).sort({createdAt:-1}).limit(1);
        
        if (!recentOtp) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        } else if (otp !== recentOtp.otp.toString()) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        
        // Check if OTP has expired (5 minutes)
        const otpAge = Date.now() - recentOtp.createdAt.getTime();
        const otpExpiryTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        
        if (otpAge > otpExpiryTime) {
            // Delete expired OTP
            await Otp.deleteOne({ _id: recentOtp._id });
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }

        const payload = {
            userId: user._id,
            phone: user.phone,
            accountType: user.accountType,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
        user.token = token;
        await user.save();
        
        // Delete the used OTP only after successful authentication
        await Otp.deleteOne({ _id: recentOtp._id });
        
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
}
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
        // Set phone as verified since admin login requires OTP verification
        user.isPhoneVerified = true;
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

// Legacy email-based login (keeping for backward compatibility)
const loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;

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
        
        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(400).json({ 
                success: false, 
                message: "Please verify your email before logging in" 
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

        // Return user data without password
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

module.exports = {
    sendOtp,
    sendPhoneOtp,
    sendSignupOtp,
    sendAdminSignupOtp,
    sendAdminLoginOtp,
    signup,
    login,
    loginWithEmail,
    createAdmin,
    promoteToAdmin,
    getUserDetails,
    updateUserDetails,
    updateAccountType,
    loginAdmin
}