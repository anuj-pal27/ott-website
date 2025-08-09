const express = require("express");
const router = express.Router();
const { addToCart, removeFromCart, getCart, updateCartItem } = require("../controller/cartController");
const { cartAddSchema, cartUpdateSchema, validateRequest } = require("../joi");
const { auth } = require("../middleware/auth");

router.post("/", auth, validateRequest(cartAddSchema), addToCart);
router.delete("/:itemId", auth, removeFromCart);
router.put("/:itemId", auth, validateRequest(cartUpdateSchema), updateCartItem);
router.get("/", auth, getCart);

module.exports = router;