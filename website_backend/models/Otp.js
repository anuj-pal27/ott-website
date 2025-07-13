const mongoose = require("mongoose");
const sendEmailOtp = require("../utils/sendEmailOtp");
const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:5*60,
    },
});

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await sendEmailOtp(email,otp);
        console.log("Email sent successfully",mailResponse);
    }catch(error){
        console.log("Error sending email",error);
    }
}

otpSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
});

const Otp = mongoose.model("Otp",otpSchema);

module.exports = Otp;

