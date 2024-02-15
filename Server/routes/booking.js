const express = require("express");
router = express.Router();
const controller = require("../Controllers/bookings");

router.post("/create", controller.createBooking);
router.delete("/delete/:id", controller.deleteBooking);

module.exports = router;
