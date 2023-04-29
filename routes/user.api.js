const express = require("express");
const authMiddleware = require("../middleware/authenticator");
const {
  getAllUser,
  createUser,
  deleteUserById,
} = require("../controllers/user.controller");
const router = express.Router();


router.get("/user", authMiddleware.loginRequired, getAllUser);
router.post("/createuser", authMiddleware.loginRequired, createUser);
router.delete("user/:id", authMiddleware.loginRequired,deleteUserById);
module.exports = router;