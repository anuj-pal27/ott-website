const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require('otp-generator');
const Otp = require("../models/Otp");
const sendEmailOtp = require("../utils/sendEmailOtp");
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
        
        const otpPayload = {email, otp};
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
        const { name, email, phone, password,otp } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("❌ User already exists:", email);
            return res.status(400).json({ 
                success: false, 
                message: "User already exists" 
            });
        }
        const recentOtp = await Otp.findOne({email}).sort({createdAt:-1}).limit(1);

        if(recentOtp.length === 0){
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        }else if(otp !== recentOtp.otp.toString()){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        // Hash password and create user (unverified)
        const hashedPassword = await bcrypt.hash(password, 10);
        const userPayload = {
            name,
            email,
            phone,
            password: hashedPassword,
            isEmailVerified: true, 
            profilePicture: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`
        };
        const userBody = await User.create(userPayload);    
        console.log("✅ User created successfully:", userBody._id);
        return res.status(200).json({ 
            success: true, 
            message: "User created successfully.",
            userId: userPayload._id
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
        
        // Update user with token (don't modify password field)
        user.token = token;
        await user.save();

        // Set HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only secure in production
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

const changePassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        // Check if current and new passwords are different
        if (currentPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from current password"
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
        
        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }
        
        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password
        user.password = hashedNewPassword;
        await user.save();
        
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
        
    } catch (error) {
        console.error("Error in changePassword:", error);
        return res.status(500).json({
            success: false,
            message: "Error in changing password"
        });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Check for recent password reset requests (rate limiting)
        const recentOtp = await Otp.findOne({ 
            email, 
            createdAt: { $gte: new Date(Date.now() - 2 * 60 * 1000) } // 2 minutes
        });
        
        if (recentOtp) {
            return res.status(429).json({
                success: false,
                message: "Please wait 2 minutes before requesting another password reset"
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
                    message: "Unable to generate OTP. Please try again."
                });
            }
        } while (await Otp.findOne({ otp }));
        
        // Create OTP record
        const otpPayload = { email, otp };
        await Otp.create(otpPayload);
        
        return res.status(200).json({
            success: true,
            message: "Password reset OTP sent successfully"
        });
        
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        return res.status(500).json({
            success: false,
            message: "Password reset failed, please try again"
        });
    }
};

// Secure admin creation function - requires special secret key
const createAdmin = async (req, res) => {
    try {
        const { name, email, phone, password, adminSecret } = req.body;
        
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
        
        // Hash password and create admin user
        const hashedPassword = await bcrypt.hash(password, 10);
        const adminPayload = {
            name,
            email,
            phone,
            password: hashedPassword,
            accountType: "admin",
            isEmailVerified: true,
            profilePicture: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`
        };
        
        const adminUser = await User.create(adminPayload);    
        console.log("Admin user created successfully:", adminUser._id);     
        
        return res.status(200).json({ 
            success: true, 
            message: "Admin user created successfully",
            user: {
                _id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                accountType: adminUser.accountType
            }
        });
        
    } catch (error) {
        console.error("Error in createAdmin:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Admin user cannot be created, please try again" 
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
                accountType: user.accountType
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
        const { email, name, phone, country, profilePicture } = req.body;
        
        const user = await User.findOne({ email });
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

module.exports = {
    sendOtp,
    signup,
    login,
    changePassword,
    forgotPassword,
    createAdmin,
    promoteToAdmin,
    getUserDetails,
    updateUserDetails,
    updateAccountType
}