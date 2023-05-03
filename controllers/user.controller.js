const userController = {};
const User = require("../models/User");
const { sendResponse, AppError } = require("../helpers/utils");
const { validationResult } = require("express-validator");
const validator = require("../middleware/validator")

userController.createUser = async (req, res, next) => {
  try {
    const { email, password, role = 'site_visitor' } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError(400, "Path email must be string", "Bad request");
    }

    if (!email || !password) {
      throw new AppError(400, "email and password are required", "Bad request");
    }

    // Check if the current user is an admin
    const currentUser = req.user;
    if (!currentUser || currentUser.role !== 'admin') {
      return sendResponse(res, 401, false, null, "Only admin user can perform this action", "Unauthorized");
    }

    const checkValueOfemail = await User.find({ email: email });
    if (checkValueOfemail.length) {
      throw new AppError(406, "email is already taken", "Bad request");
    }
    const created = await User.create({ email, password, role });
    sendResponse(res, 200, true, { data: created }, null, "User created successfully!");
  } catch (error) {
    next(error);
  }
};




userController.getAllUser = async (req, res, next) => {
  let filter = {};
  const { email } = req.query;
  email ? (filter = { email: email }) : null;
  try {
    const listOfUser = await User.find(filter);
    res.status(200).send({
      success: true,
      data: listOfUser,
      message: "Get all users successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      data: null,
      message: "Internal server error",
    });
    next(error);
  }
};

userController.deleteUserById = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    // check if user is authorized (admin role)
    const currentUser = req.user;
    if (!currentUser || currentUser.role !== 'admin') {
      return sendResponse(res, 401, false, null, "Only admin user can perform this action", "Unauthorized");
    }
    // check if id is valid ObjectId
    validator.checkObjectId(id);
    // find and delete user
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      sendResponse(res, 200, true, null, false, "User not found");
      return;
    }
    sendResponse(res, 200, true, { data: deletedUser }, null, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};

  
  

module.exports = userController;