const express = require("express");
router = express.Router();
const controller = require("../Controllers/Classes");
const { authenticate } = require("../Controllers/users");

router.get("/allclasses", controller.allClasses);

router.get("/recent", controller.getRecentClasses);

router.get("/:id", controller.getClassById);

router.get("/byinstructor/:id", controller.getInstructorClasses);

router.post("/add", authenticate, controller.addClass);

router.put("/:id", controller.updateClass);

router.delete("/:id", controller.deleteClass);

module.exports = router;
