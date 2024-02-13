const express = require("express");
router = express.Router();
const controller = require("../Controllers/Classes");

router.get("/allclasses", controller.allClasses);
// router.post("/add", controller.category_add);
router.post("/add", controller.addClass);

router.get("/:id", controller.getClassById);

router.put("/:id", controller.updateClass);

module.exports = router;
