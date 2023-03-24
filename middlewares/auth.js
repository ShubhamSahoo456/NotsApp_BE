const { verifyJWT } = require("../common/utils");
const { getUserInstance } = require("../dao/userDao");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.get("authorization");
    if (!token) {
      throw new Error("Token missing in request header");
    }
    let verifyToken;
    try {
      verifyToken = await verifyJWT(token);
    } catch (error) {
      throw new Error("Invalid Token");
    }
    if (!verifyToken) {
      throw new Error("Invalid Token");
    }

    const user = await getUserInstance({ _id: verifyToken._id });
    if (!user) {
      throw new Error("User does not exists");
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(error.status || 500).json(error.message || error);
  }
};

module.exports = {
  authenticateUser,
};
