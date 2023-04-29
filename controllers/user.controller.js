const userController = {};
const User = require("../models/User");
const { sendResponse, AppError } = require("../helpers/utils");
const { body, validationResult } = require("express-validator");
const isValidObjectId = require("./validateObjectId");

userController.createUser = async (req, res, next) => {
  try {
    const  { username, password }  = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError(400, "Path name must be string", "Bad request");
    }

    if (!username || !password) {
      throw new AppError(400, "Username and password are required", "Bad request");
    }

    const currentUser = req.user;
    const isAdmin = currentUser && currentUser.role === 'admin';
    const role = isAdmin ? 'admin' : 'site_visitor';

    const checkValueOfName = await User.find({ name:  username });
    if (checkValueOfName.length) {
      throw new AppError(406, "Name is already taken", "Bad request");
    }

    const created = await User.create({ name: username, password, role });
    sendResponse(res, 200, true, { data: created }, null, "User created successfully!");
  } catch (error) {
    next(error);
  }
};


userController.getAllUser = async (req, res, next) => {
  let filter = {};
  const { name } = req.query;
  name ? (filter = { name: name }) : null;
  try {
    const listOfUser = await User.find(filter).populate("myTask");
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
      if (req.user.role !== 'admin') {
        sendResponse(res, 401, false, null, true, 'Unauthorized');
        return;
      }
      // check if id is valid ObjectId
      isValidObjectId(id);
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