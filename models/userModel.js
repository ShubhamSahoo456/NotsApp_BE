const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    profilePic: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
    },
    isMobileVerified: {
      type: Boolean,
      default: false,
    },
    isProfileUpdated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
