var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Welcome to Coderschool !");
});
const userAPI = require('./user.api');
router.use('/user', userAPI);
const articleAPI = require('./article.api');
router.use('/article', articleAPI)
const authApi = require("./auth.api");
router.use("/auth", authApi);
module.exports = router;