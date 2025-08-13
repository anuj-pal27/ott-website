const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    isPhoneVerified:{
        type:Boolean,
        default:false,
    },
    isEmailVerified:{
        type:Boolean,
        default: true, // Set to true since we're using email/password auth
    },
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    phone:{
        type:String,
        required: false, // Made optional for email-based auth
        unique: true,
        sparse: true, // Allow multiple null values
    },
    accountType:{
        type:String,
        enum:["user","admin"],
        default:"user",
    },
    subscriptionPlan:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubscriptionPlan",
    }],
    orders:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
    }],
    profilePicture:{
        type:String,
    },
    country:{
        type:String,
    },

});

const User = mongoose.model("User",userSchema);

module.exports = User;