const express = require("express");
const { generateOtp, verifyOtp } = require("../controllers/otpController");
const validate = require("express-joi-validator");
const { otp } = require("../validations");
const { catchValidationErrors } = require("../common/utils");

const router = express.Router();

router.post(
  "/generateOtp",
  validate(otp.generateOtp),
  catchValidationErrors,
  generateOtp
);

router.post(
  "/verifyOtp",
  validate(otp.verifyOtp),
  catchValidationErrors,
  verifyOtp
);

module.exports = router;
