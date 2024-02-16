const express = require("express");
router = express.Router();
const controller = require("../Controllers/categories");

router.get("/allcategories", controller.getAllCategories);
router.get("/by-category/:categoryId", controller.getClassesByCategory);
router.get("/:categoryId", controller.getCategory);

module.exports = router;
