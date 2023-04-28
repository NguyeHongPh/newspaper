const userController = {};
const User = require("../models/User");
const { sendResponse, AppError } = require("../helpers/utils");
const { body, validationResult } = require("express-validator");
const isValidObjectId = require("./validateObjectId");

userController.createUser = async (req, res, next) => {
    try {
      const data = req.body;
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        throw new AppError(400, "Path name must be string", "Bad request");
      }
  
      if (!data.name) {
        throw new AppError(406, "Name is required", "Bad request");
      }
  
      // Check if the user making the request is an admin
      const currentUser = req.user;
      if (currentUser.role !== 'admin') {
        throw new AppError(401, "You are not authorized to perform this action", "Unauthorized");
      }
  
      const checkValueOfName = await User.find({ name: data.name });
      if (checkValueOfName.length) {
        throw new AppError(406, "name is used already", "Bad request");
      }
  
      const created = await User.create(data);
      sendResponse(res, 200, true, { data: created }, null, "Create user successfully!");
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
      message: "Get users successfully",
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