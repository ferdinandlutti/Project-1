const Review = require("../Schemas/reviews");

const addReview = async (req, res) => {
  try {
    const newReview = await Review.create(req.body);
    res.status(201).json({ ok: true, data: newReview });
  } catch (error) {
    res.status(400).json({ ok: false, message: "Failed to add review", error });
  }
};

const getClassReviews = async (req, res) => {
  const { classId } = req.params;

  try {
    const reviews = await Review.find({ classId });
    res.json({ ok: true, data: reviews });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, message: "Error fetching reviews", error });
  }
};

const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ ok: false, message: "Review not found" });
    }
    res.json({ ok: true, message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, message: "Error deleting review", error });
  }
};

module.exports = {
  addReview,
  getClassReviews,
  deleteReview,
};
