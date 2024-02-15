const express = require("express");
router = express.Router();
const controller = require("../Controllers/Classes");

router.get("/allclasses", controller.allClasses);
router.get("/:id", controller.getClassById);

router.post("/add", controller.addClass);

router.put("/:id", controller.updateClass);

router.delete("/:id", controller.deleteClass);

module.exports = router;
