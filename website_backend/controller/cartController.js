const Cart = require("../models/Cart");

const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { subscriptionPlan, quantity = 1 } = req.body;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [{ subscriptionPlan, quantity }] });
            await cart.save();
        } else {
            const existingItem = cart.items.find(item => item.subscriptionPlan.toString() === subscriptionPlan.toString());
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ subscriptionPlan, quantity });
            }
            await cart.save();
        }
        res.status(200).json({ success: true, message: "Subscription plan added to cart successfully" });
    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error adding subscription plan to cart" 
        });
    }
};

// Remove from cart by cart item _id
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        await cart.save();

        res.status(200).json({ success: true, message: "Item removed from cart successfully" });
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error removing item from cart" 
        });
    }
};

// Get cart (with populated subscriptionPlan)
const getCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ user: userId }).populate("items.subscriptionPlan");
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found", items: [] });
        }
        res.status(200).json({ success: true, cart, items: cart.items });
    } catch (error) {
        console.error("Error in getCart:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error getting cart" 
        });
    }
};

// Clear cart
const clearCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
        res.status(200).json({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
        console.error("Error in clearCart:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error clearing cart" 
        });
    }
};

module.exports = { addToCart, removeFromCart, getCart, clearCart };