var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
var indexRouter = require('./routes/index');
const {
    sendResponse
} = require("./helpers/utils");
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const mongoose = require("mongoose");

app.use('/', indexRouter);
const mongoURL = "mongodb+srv://hongpnguyen:hongpnguyen@cluster0.maiovuy.mongodb.net/?retryWrites=true&w=majority"
mongoose
    .connect(mongoURL)
    .then(() => console.log(`DB connected `))
    .catch((err) => console.log(err));
//catch when when request match no route
// catch 404 and forard to error handler
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.statusCode = 404;
    next(err);
});

/* Initialize Error Handling */
app.use((err, res) => {
    console.log("ERROR", err);
    if(err.isOperational) {
        return sendResponse(res, err.statusCode ? err.statusCode : 500, false, null, {
            message: err.message
        }, err.errorType);
    } else {
        return sendResponse(
            res,
            err.statusCode ? err.statusCode : 500,
            false,
            null, {
                message: err.message
            },
            "Internal Server Error"
        );
    }
});

module.exports = app;