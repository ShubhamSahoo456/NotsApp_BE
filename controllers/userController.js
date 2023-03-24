const { updateUserInstance } = require("../dao/userDao");

const updateUserProfile = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await updateUserInstance({ _id }, req.body);
    res.status(200).json(user);
  } catch (error) {
    return res.status(error.status || 500).json(error.message || error);
  }
};

module.exports = {
  updateUserProfile,
};
