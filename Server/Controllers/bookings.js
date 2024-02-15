const Booking = require("../Schemas/booking");
const Classes = require("../Schemas/classes");

const createBooking = async (req, res) => {
  try {
    const { classId, userId } = req.body;

    // Step 1: Fetch class details
    const classDetails = await Classes.findById(classId);
    if (!classDetails) {
      return res.status(404).json({ ok: false, message: "Class not found" });
    }

    // Step 2: Perform validation checks
    if (classDetails.attendees.length >= classDetails.capacity) {
      return res.status(400).json({ ok: false, message: "Class is full" });
    }

    if (classDetails.attendees.includes(userId)) {
      return res
        .status(400)
        .json({ ok: false, message: "User has already booked this class" });
    }

    // Additional check to prevent duplicate bookings in Booking collection

    // Step 3: Create booking and update class conditionally
    const newBooking = new Booking({ classId, userId });
    await newBooking.save();

    // Add userId to class's attendees array
    await Classes.findByIdAndUpdate(
      classId,
      { $addToSet: { attendees: userId } }, // Prevents adding duplicates
      { new: true }
    );

    res.status(201).json({ ok: true, data: newBooking });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ ok: false, message: "Failed to create booking", error });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Find the booking to get classId and userId before deletion
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ ok: false, message: "Booking not found" });
    }
    await Booking.findByIdAndDelete(bookingId);

    // Remove the user from the class's attendees array
    await Classes.findByIdAndUpdate(
      booking.classId,
      { $pull: { attendees: booking.userId } }, //
      { new: true }
    );

    res.json({ ok: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Error deleting booking" });
  }
};

module.exports = {
  createBooking,
  deleteBooking,
  //   updateBookingstatus,
  //   getAllBookings,
};
