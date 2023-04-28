const express = require("express");
const {
  getAllUser,
  createUser,
  deleteUserById,
} = require("../controllers/user.controller");
const router = express.Router();


router.get("/user", getAllUser);

router.post("/user/", createUser);
router.delete("user/:id", deleteUserById);
module.exports = router;