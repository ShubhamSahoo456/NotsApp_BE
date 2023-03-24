const mongoose = require("mongoose");

const otpSchema = mongoose.Schema(
  {
    phone: { type: String },
    otp: { type: String },
    expiration_time: { type: Date },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const OTP = mongoose.model("Otp", otpSchema);

module.exports = OTP;
