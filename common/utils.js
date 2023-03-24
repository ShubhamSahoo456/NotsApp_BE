const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const fast2sms = require("fast-two-sms");

const catchValidationErrors = (err, req, res, next) => {
  if (err.isBoom) {
    const {
      data,
      output: {
        payload: { statusCode },
      },
    } = err;
    const errorDetails = _.map(
      data,
      _.partialRight(_.pick, ["message", "path", "type"])
    );
    if (!_.has(errorDetails[0], "message")) {
      errorDetails = [];
      errorDetails.push({
        message: "Invalid inputs",
        path: `${req.path}`,
        type: `${req.method}`,
      });
    } else if (
      errorDetails[0].message.includes("fails to match the required pattern")
    ) {
      errorDetails[0].message = "Please enter valid input.";
    }
    return res
      .status(statusCode || UN_PROCESSABLE_ENTITY)
      .json({ status: statusCode, message: errorDetails[0].message })
      .end();
  }

  return next();
};

function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

const dates = {
  convert: function (d) {
    // Converts the date in d to a date-object. The input can be:
    //   a date object: returned without modification
    //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
    //   a number     : Interpreted as number of milliseconds
    //                  since 1 Jan 1970 (a timestamp)
    //   a string     : Any format supported by the javascript engine, like
    //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
    //  an object     : Interpreted as an object with year, month and date
    //                  attributes.  **NOTE** month is 0-11.
    return d.constructor === Date
      ? d
      : d.constructor === Array
      ? new Date(d[0], d[1], d[2])
      : d.constructor === Number
      ? new Date(d)
      : d.constructor === String
      ? new Date(d)
      : typeof d === "object"
      ? new Date(d.year, d.month, d.date)
      : NaN;
  },
  compare: function (a, b) {
    // Compare two dates (could be of any type supported by the convert
    // function above) and returns:
    //  -1 : if a < b
    //   0 : if a = b
    //   1 : if a > b
    // NaN : if a or b is an illegal date
    return isFinite((a = this.convert(a).valueOf())) &&
      isFinite((b = this.convert(b).valueOf()))
      ? (a > b) - (a < b)
      : NaN;
  },
  inRange: function (d, start, end) {
    // Checks if date in d is between dates in start and end.
    // Returns a boolean or NaN:
    //    true  : if d is between start and end (inclusive)
    //    false : if d is before start or after end
    //    NaN   : if one or more of the dates is illegal.
    return isFinite((d = this.convert(d).valueOf())) &&
      isFinite((start = this.convert(start).valueOf())) &&
      isFinite((end = this.convert(end).valueOf()))
      ? start <= d && d <= end
      : NaN;
  },
};

const createJWT = async (payload, secret = `${JWT_SECRET}`, options = {}) =>
  jwt.sign(payload, secret, options);

const verifyJWT = async (token, secret = `${JWT_SECRET}`) => {
  return jwt.verify(token, secret);
};

async function smsSend(options) {
  return fast2sms.sendMessage(options);
}

module.exports = {
  AddMinutesToDate,
  dates,
  catchValidationErrors,
  createJWT,
  verifyJWT,
  smsSend,
};
