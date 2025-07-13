const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    subscriptionPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
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

// Virtual for total items count
cartSchema.virtual('totalItems').get(function() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for total price
cartSchema.virtual('totalPrice').get(function() {
    return this.items.reduce((total, item) => {
        return total + (item.subscriptionPlan.price * item.quantity);
    }, 0);
});

// Ensure virtuals are serialized
cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart; 