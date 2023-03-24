const otpGenerator = require("otp-generator");
const AWS = require("aws-sdk");
const fast2sms = require("fast-two-sms");
const {
  AddMinutesToDate,
  dates,
  createJWT,
  smsSend,
} = require("../common/utils");
const { messages } = require("../common/messages");
const { REGION, ACCESS_KEY, SECRET_KEY } = require("../config");
const conn = require("../database");
const {
  getOtpInstance,
  createOtpInstance,
  updateOtpInstance,
} = require("../dao/otpDao");
const {
  getUserInstance,
  updateUserInstance,
  createUserInstance,
} = require("../dao/userDao");

AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  region: REGION, // Replace with the region you want to use
});

const generateOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      throw new Error("Phone Number not Provided");
    }
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });
    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 50);
    let existingPhone = await getOtpInstance(
      { phone },
      { createdAt: 0, updatedAt: 0 }
    );
    if (!existingPhone) {
      existingPhone = await createOtpInstance({
        phone: phone,
        otp: otp,
        expiration_time: expiration_time,
        verified: false,
      });
    } else {
      existingPhone.otp = otp;
      existingPhone.expiration_time = expiration_time;
      existingPhone.verified = false;
      const data = await updateOtpInstance(
        { _id: existingPhone._id },
        existingPhone
      );
    }
    // const params = {
    //   Message: messages.generateotp(otp),
    //   PhoneNumber: phone,
    // };
    // const publishTextPromise = new AWS.SNS();

    // publishTextPromise.publish(params, (err, data) => {
    //   if (err) {
    //     throw new Error({ Details });
    //   } else {
    //     return res
    //       .status(200)
    //       .send({ Status: "Success", Details: existingPhone });
    //   }
    // });
    res.status(200).send({ Status: "Success", Details: existingPhone });
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).json(error.message);
  }
};

const verifyOtp = async (req, res) => {
  try {
    var currentdate = new Date();
    const { otp, phone } = req.body;

    if (!otp) {
      const response = { Status: "Failure", Details: "OTP not Provided" };
      throw new Error(response);
    }
    if (!phone) {
      const response = {
        Status: "Failure",
        Details: "Phone Number not provided",
      };
      throw new Error(response);
    }
    const otp_instance = await getOtpInstance({ phone: phone });
    if (otp_instance.verified != true) {
      //Check if OTP is expired or not
      if (dates.compare(otp_instance.expiration_time, currentdate) == 1) {
        //Check if OTP is equal to the OTP in the DB
        if (otp === otp_instance.otp) {
          // Mark OTP as verified or used
          otp_instance.verified = true;
          const session = await conn.startSession();
          let userInstance;
          await session.withTransaction(async () => {
            await updateOtpInstance({ _id: otp_instance._id }, otp_instance, {
              session,
            });
            userInstance = await getUserInstance({ mobile: phone });
            if (userInstance) {
              await updateUserInstance(
                { _id: userInstance._id },
                { isMobileVerified: true },
                {
                  session,
                }
              );
            } else {
              userInstance = await createUserInstance(
                {
                  mobile: phone,
                  isMobileVerified: true,
                },
                { session }
              );
              console.log("session", userInstance);
            }
            return userInstance;
          });
          await session.endSession();
          console.log("140", userInstance);
          const token = await createJWT(
            {
              _id: userInstance._id,
            },
            undefined,
            { expiresIn: "15h" }
          );

          const response = {
            Status: "Success",
            Details: "OTP Matched",
            token: token,
          };
          return res.status(200).json(response);
        } else {
          throw new Error("OTP NOT Matched");
        }
      } else {
        throw new Error("OTP Expired");
      }
    } else {
      throw new Error("OTP Already Used");
    }
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json(error.message);
  }
};

module.exports = { generateOtp, verifyOtp };
