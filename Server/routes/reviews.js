const router = require("express").Router();
const controller = require("../Controllers/reviews");

router.get("/getclassreviews/:classId", controller.getClassReviews);

router.post("/add", controller.addReview);

router.delete("/delete/:reviewId", controller.deleteReview);

module.exports = router;
