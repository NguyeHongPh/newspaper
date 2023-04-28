var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const mongoose = require("mongoose");

app.use('/', indexRouter);
const mongoURL = "mongodb+srv://hongpnguyen:hongpnguyen@cluster0.maiovuy.mongodb.net/test"
mongoose
  .connect(mongoURL)
  .then(() => console.log(`DB connected ${mongoURL} `))
  .catch((err) => console.log(err));
//catch when when request match no route
app.use((req, res, next) => {
    const exception = new Error(`Path not found`);
    exception.statusCode = 404;
    next(exception);
  });
  
module.exports = app;
