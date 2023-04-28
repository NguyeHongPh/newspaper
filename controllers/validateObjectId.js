const ObjectId = require("mongoose").Types.ObjectId;
const { AppError } = require("../helpers/utils");

// function check if _id is ObjectID
const isValidObjectId = (id) => {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) {
      return true;
    } else {
      throw new AppError(406, "id invalid", "Bad request");
    }
  }
  throw new AppError(406, "id invalid", "Bad request");
};

module.exports = isValidObjectId;