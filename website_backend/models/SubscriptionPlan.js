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
            enum: ['1 Month', '3 Months', '6 Months', '1 Year', 'Lifetime', 'One-time'],
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
        durationInDays: {
            type: Number,
            default: null
        },
    }],
    planType:{
        type:String,
        required:true,
    },
    // Updated categories to include new service types
    category: {
        type: String,
        enum: [
            'subscriptions',
            'software',
            'websites',
            'tools',
            'music',
            'design',
            'marketing',
            'hosting',
            'other',
            'AI TOOLS',
            'GRAPHICS AND VIDEO EDITING SERVICES',
            'WRITING TOOLS SERVICES',
            'PRODUCTIVITY AND OFFICE MANAGEMENT SERVICES',
            'ONLINE MARKETING And SOFTWARE',
            'DATA EXTRACTER SERVICES',
            'DATING SUBSCRIPTION',
            'ONLINE ENTERTAINMENT SERVICES',
            'featured' // Added featured as a category
        ],
        required: true,
    },
    features: [String],
    iconImage: {
        type:String,
    },
    sampleLink: {
        type: String
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