const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");
const sendSmsOtp = require("../utils/sendSmsOtp");

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:false, // Made optional to support phone-based OTP
    },
    phone:{
        type:String,
        required:false, // Made optional to support email-based OTP
    },
    otp:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        enum:['email', 'phone'],
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:5*60, // 5 minutes
    },
});

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await sendEmail(email,otp);
        console.log("Email sent successfully",mailResponse);
    }catch(error){
        console.log("Error sending email",error);
    }
}

async function sendVerificationSms(phone,otp){
    try{
        const smsResponse = await sendSmsOtp(phone,otp);
        console.log("SMS sent successfully",smsResponse);
    }catch(error){
        console.log("Error sending SMS",error);
    }
}

otpSchema.pre("save",async function(next){
    if (this.type === 'email') {
        await sendVerificationEmail(this.email,this.otp);
    } else if (this.type === 'phone') {
        await sendVerificationSms(this.phone,this.otp);
    }
    next();
});

const Otp = mongoose.model("Otp",otpSchema);

module.exports = {Otp, sendVerificationEmail, sendVerificationSms};

