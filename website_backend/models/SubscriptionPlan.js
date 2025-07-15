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
    // New field for multiple duration options
    durations: [{
        duration: {
            type: String,
            enum: ['1 Month', '3 Months', '6 Months', '1 Year'],
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        originalPrice: {
            type: Number,
            required: true
        },
        slotsAvailable: {
            type: Number,
            default: 0
        },
        totalSlots: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    }],
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