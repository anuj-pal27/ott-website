const phonepe = require("../config/PhonePe");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const User = require("../models/User");
const Cart = require("../models/Cart");
const sendEmailOtp = require("../utils/sendEmailOtp");
const orderPlacedEmailTemplate = require("../utils/orderPlacedEmailTemplate");

// Create checkout session (PhonePe)
const checkout = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ user: userId }).populate("items.subscriptionPlan");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // For each cart item, find the selected duration details
        const items = cart.items.map(item => {
            const plan = item.subscriptionPlan;
            const selectedDuration = plan.durations.find(d => d.duration === item.duration);
            return {
                subscriptionPlan: plan._id,
                selectedDuration: selectedDuration ? {
                    duration: selectedDuration.duration,
                    description: selectedDuration.description,
                    price: selectedDuration.price,
                    originalPrice: selectedDuration.originalPrice
                } : null,
                priceAtPurchase: selectedDuration ? selectedDuration.price : 0
            };
        });

        const totalAmount = items.reduce((sum, item) => sum + item.priceAtPurchase, 0);

        // For simplicity, create one order for the first item (or loop for all if you want multiple orders)
        const firstItem = items[0];
        const order = new Order({
            userId: userId,
            subscriptionId: firstItem.subscriptionPlan,
            selectedDuration: firstItem.selectedDuration,
            payment: [],
            startDate: new Date(),
        });
        await order.save();

        // Create PhonePe Order
        const phonepeOrder = await phonepe.createPhonePeOrder(order._id.toString(), totalAmount, userId);
        if (!phonepeOrder.success) {
            return res.status(500).json({ success: false, message: "Failed to create PhonePe order", details: phonepeOrder });
        }

        // Create Payment record
        const payment = new Payment({
            order: order._id,
            paymentAmount: totalAmount,
            paymentId: order._id.toString(), // Use order ID as payment ID for PhonePe
            paymentStatus: "pending",
            paymentMethod: "phonepe",
        });
        await payment.save();

        // Update order with payment reference
        order.payment.push(payment._id);
        await order.save();

        // Clear cart after successful order creation
        await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

        res.status(200).json({
            success: true,
            message: "Order created successfully",
            orderId: order._id,
            phonepeOrder,
            amount: totalAmount,
            currency: "INR",
        });

    } catch (error) {
        console.error("Error in checkout:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error in checkout" 
        });
    }
};

// Verify payment (PhonePe)
const verifyPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({ success: false, message: "Missing orderId" });
        }
        // Check payment status with PhonePe
        const statusResponse = await phonepe.checkPhonePePaymentStatus(orderId);
        if (!statusResponse.success) {
            return res.status(400).json({ success: false, message: "Payment verification failed", details: statusResponse });
        }
        const paymentStatus = statusResponse.data && statusResponse.data.paymentInstrumentResponseData && statusResponse.data.paymentInstrumentResponseData.status;
        if (paymentStatus !== 'SUCCESS') {
            return res.status(400).json({ success: false, message: "Payment not successful", status: paymentStatus });
        }
        // Find and update payment
        const payment = await Payment.findOne({ paymentId: orderId });
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }
        payment.paymentStatus = "success";
        payment.paymentDate = new Date();
        await payment.save();
        // Update order
        const order = await Order.findById(payment.order);
        if (order) {
            // Calculate end date based on subscription duration
            const subscriptionPlan = await require("../models/SubscriptionPlan").findById(order.subscriptionId);
            if (subscriptionPlan && subscriptionPlan.durationInDays) {
                order.endDate = new Date(order.startDate.getTime() + (subscriptionPlan.durationInDays * 24 * 60 * 60 * 1000));
            }
            await order.save();
            // Add subscription to user
            const user = await User.findByIdAndUpdate(order.userId, { $push: { subscriptionPlan: order.subscriptionId } }, { new: true });
            // Send confirmation email
            if (user) {
                const emailHtml = orderPlacedEmailTemplate({
                    userName: user.name,
                    orderId: order._id,
                    orderDetails: `Subscription: ${subscriptionPlan?.serviceName || 'N/A'}`,
                    orderDate: order.createdAt
                });
                await sendEmailOtp(user.email, "Order Confirmation", emailHtml);
            }
        }
        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            paymentId: orderId
        });
    } catch (error) {
        console.error("Error in verifyPayment:", error);
        res.status(500).json({
            success: false,
            message: "Error in payment verification"
        });
    }
};

// Get payment history for user
const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.userId;

        const payments = await Payment.find({})
            .populate({
                path: 'order',
                match: { userId: userId }
            })
            .populate('order.subscriptionId');

        // Filter out payments that don't belong to the user
        const userPayments = payments.filter(payment => payment.order);

        res.status(200).json({
            success: true,
            payments: userPayments
        });

    } catch (error) {
        console.error("Error in getPaymentHistory:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching payment history"
        });
    }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const userId = req.user.userId;

        const payment = await Payment.findById(paymentId)
            .populate({
                path: 'order',
                match: { userId: userId }
            })
            .populate('order.subscriptionId');

        if (!payment || !payment.order) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        res.status(200).json({
            success: true,
            payment
        });

    } catch (error) {
        console.error("Error in getPaymentById:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching payment"
        });
    }
};

module.exports = {
    checkout,
    verifyPayment,
    getPaymentHistory,
    getPaymentById
};