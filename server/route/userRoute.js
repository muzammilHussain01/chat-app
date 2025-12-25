const express = require("express");
const router = express.Router();

const userController = require("../controller/groupController");
const singleUserController = require("../controller/singleUserController");
const uploadAvatar = require("../middleware/multerMiddleware")
console.log(typeof uploadAvatar)

router.post("/users", userController);
router.post("/single_user", uploadAvatar.single("avatar"), singleUserController)

module.exports = router;
