const {AppError,sendResponse} = require("../helpers/utils");
  const User = require("../models/User");
  const express = require('express');
  const bodyParser = require('body-parser')
  const app = express();
  const authController = {};
  app.use(bodyParser.json()) // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true }))
  
  authController.loginWithemailandPassword = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      return next(new AppError(400, "Invalid email", "Login Error"));
    }
  
    const isMatch = password === user.password;
  
    if (!isMatch) {
      return next(new AppError(400, "Invalid password", "Login Error"));
    }
    accessToken = await user.generateToken();
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login successful"
  );
  };

  
  
  
  module.exports = authController;