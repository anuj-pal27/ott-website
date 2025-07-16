const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    serviceName:{
        type:String,
        required:true,
    },
    description:{
        type:String,
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
        },
        startDate:{
            type:Date,
        },
        endDate:{
            type:Date,
        },
    }],
    planType:{
        type:String,
        required:true,
    },
    category: {
        type: String,
        enum: ['music', 'ott', 'professional', 'others'],
        required: true,
    },
    features: [String],
    iconImage: {
        type:String,
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