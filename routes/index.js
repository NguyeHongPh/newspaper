var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
const userAPI = require('./user.api');
router.use('/users', userAPI);
const articleAPI = require('./article.api');
router.use('/article', articleAPI)
module.exports = router;