const User = require("../models/userModel");

const getUserInstance = (query, projection = {}, session = {}) =>
  User.findOne(query, projection, session).lean().exec();

const updateUserInstance = (query, update = {}, session = {}) =>
  User.updateOne(query, update, session);

const createUserInstance = (userInfo, session = {}) =>
  new User(userInfo, session).save();

module.exports = {
  getUserInstance,
  updateUserInstance,
  createUserInstance,
};
