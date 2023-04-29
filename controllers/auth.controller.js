const {AppError} = require("../helpers/utils");
  const User = require("../models/User");
  const express = require('express');
  const bodyParser = require('body-parser')
  const app = express();
  const authController = {};
  const base64 = require("base-64");
  app.use(bodyParser.json()) // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true }))
  
  authController.loginWithUsernameandPassword = async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
  
    if (!user) {
      return next(new AppError(400, "Invalid username or password", "Login Error"));
    }
  
    const isMatch = password === user.password;
  
    if (!isMatch) {
      return next(new AppError(400, "Invalid password", "Login Error"));
    }
  
    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  };
  
  
  module.exports = authController;