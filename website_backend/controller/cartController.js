const Cart = require("../models/Cart");

const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { subscriptionPlan, duration } = req.body;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [{ subscriptionPlan, duration }] });
            await cart.save();
        } else {
            const existingItem = cart.items.find(item => item.subscriptionPlan.toString() === subscriptionPlan.toString() && item.duration === duration);
            if (!existingItem) {
                cart.items.push({ subscriptionPlan, duration });
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

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { itemId } = req.params;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        await cart.save();
        res.status(200).json({ success: true, message: "Item removed from cart successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error removing item from cart" });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ user: userId }).populate("items.subscriptionPlan");
        if (!cart) {
            return res.status(200).json({ success: true, cart: { items: [] } });
        }
        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching cart" });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { itemId } = req.params;
        const { duration } = req.body;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const item = cart.items.find(item => item._id.toString() === itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        // Update the duration
        item.duration = duration;
        await cart.save();

        // Return updated cart
        const updatedCart = await Cart.findOne({ user: userId }).populate("items.subscriptionPlan");
        res.status(200).json({ success: true, message: "Cart item updated successfully", cart: updatedCart });
    } catch (error) {
        console.error("Error in updateCartItem:", error);
        res.status(500).json({ success: false, message: "Error updating cart item" });
    }
};

module.exports = { addToCart, removeFromCart, getCart, updateCartItem };