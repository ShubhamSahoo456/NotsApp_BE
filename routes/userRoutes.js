const express = require("express");
const validate = require("express-joi-validator");
const { catchValidationErrors } = require("../common/utils");
const { updateUserProfile } = require("../controllers/userController");
const { authenticateUser } = require("../middlewares/auth");
const { user } = require("../validations");

const router = express.Router();

router.post(
  "/updateUserprofile",
  authenticateUser,
  validate(user.updateUser),
  catchValidationErrors,
  updateUserProfile
);

module.exports = router;
