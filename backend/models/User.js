//generate a basic user schema
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  interviewsLeft: {
    type: Number,
    default: 2,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
