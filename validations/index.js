const Joi = require("joi");

const otp = {
  generateOtp: {
    body: Joi.object().keys({
      phone: Joi.string().required().trim(),
    }),
  },
  verifyOtp: {
    body: Joi.object().keys({
      otp: Joi.string().min(6).max(6).required().trim(),
      phone: Joi.string().required().trim(),
    }),
  },
};

const user = {
  updateUser: {
    body: Joi.object().keys({
      firstName: Joi.string().min(2).max(50).required().trim(),
      lastName: Joi.string().min(2).max(20).required().trim(),
      profilePic: Joi.string().optional(),
      mobile: Joi.string().required().trim(),
      isMobileVerified: Joi.boolean().optional(),
      isProfileUpdated: Joi.boolean().optional(),
    }),
  },
};

module.exports = {
  otp,
  user,
};
