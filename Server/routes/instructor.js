const express = require("express");
router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const controller = require("../Controllers/instructor");
const { authenticate } = require("../Controllers/users");

router.post(
  "/details",
  authenticate,
  upload.single("profilePicture"),
  controller.instructorDetails
);
router.put("/:id", controller.updateProfile);
router.get("/:id", controller.instructorProfile);

module.exports = router;
