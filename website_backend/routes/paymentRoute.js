const express = require("express");
const router = express.Router();
const {checkout,verifyPayment,getPaymentHistory,getPaymentById} = require("../controller/Payment");
const {auth} = require("../middleware/auth");

router.post("/checkout", auth, checkout);
router.post("/verify-payment",verifyPayment); // No auth needed for webhook
router.get("/payment-history", auth, getPaymentHistory);
router.get("/payment-details/:id", auth, getPaymentById);

module.exports = router;