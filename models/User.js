const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
require("dotenv").config()

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "site_visitor"],
    default: "site_visitor",//default new user will be site_visitor
  },
  password: {
    type: String,
    required: true,
  }
});

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "25m",
  });
  return accessToken;
};


module.exports = mongoose.model("User", userSchema);
