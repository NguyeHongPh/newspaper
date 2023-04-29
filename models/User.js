const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
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


module.exports = mongoose.model("User", userSchema);
