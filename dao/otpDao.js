const Otp = require("../models/otpModel");

const getOtpInstance = (query, projection = {}, session = {}) =>
  Otp.findOne(query, projection, session).lean().exec();

const updateOtpInstance = (query, update = {}, session = {}) =>
  Otp.updateOne(query, update, session);

const createOtpInstance = (otpInfo) => new Otp(otpInfo).save();

module.exports = {
  getOtpInstance,
  updateOtpInstance,
  createOtpInstance,
};
