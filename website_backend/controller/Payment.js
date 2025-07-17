const Payment = require("../models/Payment");
const Order = require("../models/Order");
const User = require("../models/User");
const Cart = require("../models/Cart");
const sendEmailOtp = require("../utils/sendEmailOtp");
const orderPlacedEmailTemplate = require("../utils/orderPlacedEmailTemplate");
const PhonePe = require("../config/PhonePe");
// const { StandardCheckoutClient, Env, StandardCheckoutPayRequest } = require('pg-sdk-node');
// const { randomUUID } = require('crypto');

// const clientId = 'TEST-M23IDUHMGXY2Q_25070';
// const clientVersion = 1;
// const clientSecret = 'NDZINTczNWYtZGEzMiOOZmEwLTk2NDItZGNINzRkZTFjMDM1';
// const env = Env.SANDBOX;

// const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

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
        // const merchantOrderId = randomUUID();
        // const redirectUrl = `http://localhost:8080/api/payment/check-status?merchantOrderId=${merchantOrderId}`;

        // // Build the Standard Checkout request
        // const request = StandardCheckoutPayRequest.builder()
        //     .merchantOrderId(merchantOrderId)
        //     .amount(totalAmount)
        //     .redirectUrl(redirectUrl)
        //     .build();
        // console.log('StandardCheckoutPayRequest:', request);

        // // Create PhonePe Order using SDK
        // const response = await client.pay(request);
        // console.log('PhonePe SDK pay response:', response);

        // // Extract payment URL from SDK response
        // const paymentUrl = response?.data?.instrumentResponse?.redirectInfo?.url;
        // if (!paymentUrl) {
        //     return res.status(500).json({ success: false, message: "Failed to get payment URL from PhonePe", details: response });
        // }
         const response = await PhonePe.createPhonePeOrder(order._id, totalAmount, userId);
         console.log('PhonePe Order Creation Response:', response);
         const paymentUrl = response?.data?.instrumentResponse?.redirectInfo?.url;
         if (!paymentUrl) {
            return res.status(500).json({ success: false, message: "Failed to get payment URL from PhonePe", details: response });
         }
        // Create Payment record
        const payment = new Payment({
            order: order._id,
            paymentAmount: totalAmount,
            // paymentId: merchantOrderId, // Use merchantOrderId as payment ID for PhonePe
            paymentId: response?.data?.instrumentResponse?.redirectInfo?.url,
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
            // merchantOrderId,
            paymentId: response?.data?.instrumentResponse?.redirectInfo?.url,
            paymentUrl,
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
        // // For Standard Checkout, merchantOrderId is used
        // const { merchantOrderId } = req.body;
        // if (!merchantOrderId) {
        //     return res.status(400).json({ success: false, message: "Missing merchantOrderId" });
        // }
        // // Check payment status with PhonePe SDK
        // const statusResponse = await client.getPaymentStatus(merchantOrderId);
        // console.log('PhonePe SDK status response:', statusResponse);
        // const paymentStatus = statusResponse?.data?.state;
        // if (paymentStatus !== 'COMPLETED') {
        //     return res.status(400).json({ success: false, message: "Payment not successful", status: paymentStatus });
        // }
        const { orderId } = req.body;
        const response = await PhonePe.checkPhonePePaymentStatus(orderId);
        console.log('PhonePe Payment Status Response:', response);
        const paymentStatus = response?.data?.state;
        if (paymentStatus !== 'COMPLETED') {
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