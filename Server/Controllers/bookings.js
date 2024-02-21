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
const getBookingsByClass = async (req, res) => {
  const { classId } = req.params; // Extract classId from URL parameters

  try {
    const bookings = await Booking.find({ classId }).populate(
      "userId",
      "email"
    ); // Example: Populating user email. Adjust as needed.
    res.json({ ok: true, data: bookings });
  } catch (error) {
    console.error("Error fetching bookings for class:", error);
    res
      .status(500)
      .json({ ok: false, message: "Error fetching bookings for class", error });
  }
};
const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params; // Get the booking ID from URL parameters
  const { status } = req.body; // Get the new status from the request body

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true, runValidators: true } // Return the updated booking and ensure schema validators run
    )
      .populate("classId")
      .populate("userId"); // Populate related fields if needed

    if (!updatedBooking) {
      return res.status(404).json({ ok: false, message: "Booking not found" });
    }

    res.json({ ok: true, data: updatedBooking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res
      .status(500)
      .json({ ok: false, message: "Error updating booking status", error });
  }
};
const getBookingsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ userId }).populate("classId"); // Assuming each booking references 'classId' for class details

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "No bookings found for this user." });
    }

    res.json({ ok: true, data: bookings });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    res
      .status(500)
      .json({
        ok: false,
        message: "Error fetching bookings",
        error: error.message,
      });
  }
};

module.exports = {
  createBooking,
  deleteBooking,
  getBookingsByClass,
  updateBookingStatus,
  getBookingsByUser,
  //   getAllBookings,
};
