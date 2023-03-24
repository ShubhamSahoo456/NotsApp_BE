const messages = {
  generateotp: (otp) =>
    `Dear User,\n` +
    `${otp} is your otp for Phone Number Verfication. Please enter the OTP to verify your phone number.\n` +
    `Regards\n` +
    `Instant Chat Team`,
  verifyOtp: "Hurray!!...Your account has been verified.",
};

module.exports = {
  messages,
};
