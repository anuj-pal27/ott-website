const express = require("express");
const router = express.Router();
const { addToCart, removeFromCart, getCart } = require("../controller/cartController");
const { cartAddSchema, validateRequest } = require("../joi");
const { auth } = require("../middleware/auth");

router.post("/", auth, validateRequest(cartAddSchema), addToCart);
router.delete("/:itemId", auth, removeFromCart);
router.get("/", auth, getCart);

module.exports = router;