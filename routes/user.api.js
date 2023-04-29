const express = require("express");
const authMiddleware = require("../middleware/authenticator");
const router = express.Router();
const userController = require("../controllers/user.controller")




router.get("/alluser", authMiddleware.loginRequired, userController.getAllUser);
router.post("/createuser", authMiddleware.loginRequired, userController.createUser);
router.delete("user/:id", authMiddleware.loginRequired,userController.deleteUserById);



module.exports = router;