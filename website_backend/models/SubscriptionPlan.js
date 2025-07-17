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
    }],
    planType:{
        type:String,
        required:true,
    },
    // Updated categories to include new service types
    category: {
        type: String,
        enum: [
            'subscriptions',    // Netflix, Prime, etc.
            'software',         // Adobe, Office, etc.
            'websites',         // Instant websites, templates
            'tools',           // Development tools, utilities
            'courses',         // Online courses, tutorials
            'design',          // Design resources, templates
            'marketing',       // Marketing tools, analytics
            'hosting',         // Web hosting, domains
            'other'            // Miscellaneous services
        ],
        required: true,
    },
    // New field for service type
    serviceType: {
        type: String,
        enum: [
            'streaming',       // Netflix, Prime, etc.
            'music',           // Spotify, Apple Music
            'software',        // Adobe, Office, etc.
            'website',         // Instant websites
            'template',        // Website templates
            'course',          // Online courses
            'tool',            // Development tools
            'design',          // Design resources
            'hosting',         // Web hosting
            'domain',          // Domain names
            'other'            // Other services
        ],
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