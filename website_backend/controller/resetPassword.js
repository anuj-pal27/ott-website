const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sendEmailOtp = require("../utils/sendEmailOtp");



const resetPasswordLink = async (req, res) => {
    try {
        const { email} = req.body;
        
        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }
        
        // Validate email format
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        
        const token = crypto.randomUUID();
        const updatedDetails = await User.findOneAndUpdate({email},{token,resetPasswordExpires:Date.now()+5*60*1000},{new:true});
        
        const url =`http://localhost:3000/update-password/${token}`;
        
        await sendEmailOtp(email,"Password Reset Link",`Password Reset Link: ${url}`);
         
        return res.status(200).json({
            success: true,
            message: "Email has been sent successfully"
        });
        
    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(500).json({
            success: false,
            message: "Email has not been sent successfully, please try again"
        });
    }
};

const resetPassword = async (req,res) =>{
    try{
        const {password,confirmPassword,token} = req.body;
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirm password are not same"
            });
        }
        const user = await User.findOne({token});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            });
        }
        if(user.resetPasswordExpires < Date.now()){
            return res.status(400).json({
                success:false,
                message:"Token is expired"
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await User.findOneAndUpdate({token},{password:hashedPassword},{new:true});
        return res.status(200).json({
            success:true,
            message:"Password has been updated successfully"
        });
    }catch(error){
        console.error("Error in resetPassword:", error);
    }
}

module.exports = {
    resetPasswordLink,
    resetPassword
}