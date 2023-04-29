const express = require("express");
const authMiddleware = require("../middleware/authenticator");
const router = express.Router();
const userController = require("../controllers/user.controller")




router.get("/", authMiddleware.loginRequired, userController.getAllUser);
router.post("/", authMiddleware.loginRequired, userController.createUser);
router.delete("/:id", authMiddleware.loginRequired,userController.deleteUserById);



module.exports = router;