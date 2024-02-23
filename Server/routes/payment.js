const express = require("express");
const router = express.Router();

const controller = require("../Controllers/payment");

router.post("/create-checkout-session", controller.create_checkout_session);
router.get("/checkout-session", controller.checkout_session);

module.exports = router;
