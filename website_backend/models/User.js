const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:false, // Made optional for phone-based auth
        unique:true,
        sparse: true, // Allow multiple null values
    },
    isPhoneVerified:{
        type:Boolean,
        default:false,
    },
    isEmailVerified:{
        type:Boolean,
        default: false,
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
        required: true, // Made required for phone-based auth
        unique: true,
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