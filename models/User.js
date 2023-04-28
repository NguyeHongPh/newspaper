const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "site_visitor"],
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
