const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    subscriptionPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
        required: true
    },
    duration: {
        type: String,
        enum: ['1 Month', '3 Months', '6 Months', '1 Year'],
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
cartSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Remove totalItems and totalPrice virtuals since quantity is gone

// Ensure virtuals are serialized
cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart; 