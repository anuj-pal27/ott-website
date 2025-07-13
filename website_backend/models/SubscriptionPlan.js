const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    serviceName:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
        required:true,
    },
    durationInDays:{
        type:Number,
    },
    planType:{
        type:String,
        required:true,
    },
    originalPrice:{
        type:Number,
    },
    slotsAvailable:{
        type:Number,
    },
    totalSlots:{
        type:Number,
    },
    features: [String],
    iconImage: {
        type:String,
    },
    startDate:{
        type:Date,
    },
    endDate:{
        type:Date,
    },
    isActive: { type: Boolean, default: true },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    },
});

const SubscriptionPlan = mongoose.model("SubscriptionPlan",subscriptionSchema);

module.exports = SubscriptionPlan;