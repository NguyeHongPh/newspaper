var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
    res.send("Welcome to the Fake News Times!");
});
// User Api
const userAPI = require('./user.api');
router.use('/user', userAPI);
// Article API
const articleAPI = require('./article.api');
router.use('/article', articleAPI)
// Auth api
const authApi = require("./auth.api");
router.use("/auth", authApi);
module.exports = router;