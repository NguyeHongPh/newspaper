const express = require("express");
const authMiddleware = require("../middleware/authenticator");
const router = express.Router();
const userController = require("../controllers/user.controller")

/**
 * @route GET /users/
 * @description Get all users info
 * @access Login required
 */
router.get("/", authMiddleware.loginRequired, userController.getAllUser);
/**
 * @route POST /users/createuser
 * @description create user
 * @access Login and admin role required
 */
router.post("/", authMiddleware.loginRequired, userController.createUser);
/**
 * @route PUT /users/
 * @description change user password
 * @access Login and admin role required
 */
router.put("/:id", authMiddleware.loginRequired, userController.changeDetail);
/**
 * @route POST /users/register user
 * @description register user
 */
router.post("/register",  userController.registerUser);
/**
 * @route delete /users/
 * @description delete user
 * @access Login and admin role required
 */
router.delete("/:id", authMiddleware.loginRequired,userController.deleteUserById);



module.exports = router;