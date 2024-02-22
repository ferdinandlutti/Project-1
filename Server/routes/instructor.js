const express = require("express");
const router = express.Router();

const controller = require("../Controllers/instructor");
const { authenticate } = require("../Controllers/users");

router.post("/details", authenticate, controller.instructorDetails);
router.put("/:id", controller.updateProfile);
router.get("/:id", controller.instructorProfile);

module.exports = router;
