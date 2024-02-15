const router = require("express").Router();
const controller = require("../Controllers/users");

router.post("/register", controller.register, controller.login);
router.post("/login", controller.login);
router.post("/verify_token", controller.verify_token);
router.get("/allusers", controller.getAllUsers);
router.get("/allinstructors", controller.getInstructors);
router.get("/allnormalusers", controller.getNormalUsers);

router.delete("/:id", controller.deleteUser);
router.put("/:id", controller.updateUser);
router.get("/:id", controller.getUserById);

module.exports = router;
