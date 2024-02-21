const express = require("express");
router = express.Router();
const controller = require("../Controllers/bookings");

router.get("/by_class/:classId", controller.getBookingsByClass);
router.get("/by_user/:userId", controller.getBookingsByUser);

router.post("/create", controller.createBooking);
router.delete("/delete/:id", controller.deleteBooking);
router.put("/:bookingId/status", controller.updateBookingStatus);

module.exports = router;
