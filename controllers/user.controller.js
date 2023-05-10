const userController = {};
const User = require("../models/User");
const { sendResponse, AppError } = require("../helpers/utils");
const { validationResult } = require("express-validator");
const validator = require("../middleware/validator")
const bcrypt = require('bcrypt');
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

userController.registerUser = async (req, res, next) => {
  try {
   
    const { email, password } = req.body;
    const errors = validationResult(req);
    const defaultRole = 'site_visitor'; //since the const variable is not possible to change, create another variable and check it with role
    let { role } = req.body;
    if (!role || role === 'site_visitor') {
      role = defaultRole;
    } else { 
      throw new AppError(403, "You can only create a new user with site_visitor role");
    }
    if (!errors.isEmpty()) {
      throw new AppError(422, "Path email must be string", "Unprocessable Entity");
    }

    if (!email || !password) {
      throw new AppError(422, "email and password are required", "Unprocessable Entity");
    }
    // Check if password meets criteria. The regex pattern has been updated to allow special characters in addition to the ones already allowed
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&#^_])[A-Za-z\d@$!%?&#^_]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new AppError(422, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.", "Unprocessable Entity");
    }
    // Using findOne instead of find to return a single document
    const checkValueOfemail = await User.findOne({ email: email });
    if (checkValueOfemail) {
      throw new AppError(409, "email is already taken", "Conflict");
    }
    const user = new User({ email, password, role });
    const created = await user.save();
    //Removed it and instead sent the response directly from here.
    sendResponse(res,200,{ data: created }, null, "User registration successfully!");
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
    
    // Hash passwords of all users
    const hashedUsers = await Promise.all(listOfUser.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      return user;
    }));

    res.status(200).send({
      success: true,
      data: hashedUsers,
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

// Function to generate a random password
function generateNewPassword() {
  const length = 10;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%?&#^_';
  let newPassword = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    newPassword += characters.charAt(randomIndex);
  }

  return newPassword;
}

userController.changeDetail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const currentUser = req.user;

    // Check if the current user is an admin
    if (!currentUser || currentUser.role !== 'admin') {
      return sendResponse(res, 401, false, null, "Only admin user can perform this action", "Unauthorized");
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(404, `User with email ${email} not found`, 'User not found');
    }

    // Generate a new password
    const newPassword = generateNewPassword(); // Implement your logic for generating a new password here

    // Update the user's password with the new password
    user.password = newPassword;
    await user.save();

    sendResponse(res, 200, true, { newPassword }, null, "Password changed successfully!");
  } catch (error) {
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