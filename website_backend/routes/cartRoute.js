const express = require("express");
const router = express.Router();
const {addToCart,removeFromCart,getCart,clearCart} = require("../controller/cartController");


router.post("/cart",addToCart);
// Remove a specific item from cart (by item ID)
router.delete("/cart/:itemId", removeFromCart);
router.get("/cart",getCart);
// Clear the entire cart
router.delete("/cart/clear", clearCart);

module.exports = router;