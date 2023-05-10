const {
  sendResponse
} = require("../helpers/utils");
const mongoose = require("mongoose");
const {
  validationResult, param
} = require("express-validator");
const validators = {};


validators.validate = (validationArray) => async (req, res, next) => {
  await Promise.all(validationArray.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if(errors.isEmpty()) return next();
  const message = errors
      .array()
      .map((error) => error.msg)
      .join(" & ");
  return sendResponse(res, 422, false, null, {
      message
  }, "Validation Error");
};

validators.checkObjectId = (paramName) => {
  return param({ name: paramName }).custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error(`Invalid ${paramName}`);
    }
    return true;
  });
};


module.exports = validators;