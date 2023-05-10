const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
    AppError
} = require("../helpers/utils");
const authMiddleware = {};

authMiddleware.loginRequired = (req, res, next) => {
    try {
        const JWT_SECRET_KEY = "Yoursecretkey";//due to the issue with .env file I decided to put the JWT_SECRET_KEY here
        if(!JWT_SECRET_KEY) {
            const error = new Error("JWT_SECRET_KEY is not defined");
            error.code = "INTERNAL_SERVER_ERROR";
            throw error;
        }

        const tokenString = req.headers.authorization;

        if(!tokenString) {
            return next(
                new AppError(401, "Login required", "Validation Error")
            );
        }

        const token = tokenString.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET_KEY, async (err, payload) => {
            if(err) {
                const validationError =
                    err.name === "TokenExpiredError" ?
                    new AppError(401, "Token expired", "Validation Error") :
                    new AppError(401, "Token is invalid", "Validation Error");
                console.log(err);
                return next(validationError);
            }
            const user = await User.findById(payload._id);
            req.user = user;
            next();
        });
    } catch (error) {
        next(error);
    }
};



module.exports = authMiddleware;