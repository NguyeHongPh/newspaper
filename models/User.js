const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "Yoursecretkey"
const { isEmail } = require('validator');

require("dotenv").config()

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [
      {
        validator: function (value) {
          return isEmail(value);
        },
        msg: 'Invalid email.',
      },
    ],
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
  },
  role: {
    type: String,
    enum: ['admin', 'site_visitor'],
    default: 'site_visitor',
  },
});



userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "55m",
  });
  return accessToken;
};


module.exports = mongoose.model("User", userSchema);
