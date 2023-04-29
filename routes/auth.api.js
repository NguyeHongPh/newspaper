const express = require('express');
const router = express.Router();
const app = express();
const { body } = require("express-validator");
const bodyParser = require('body-parser')
const validators = require("../middleware/validator");
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

const authController = require('../controllers/auth.controller');

router.post("/login", 
  validators.validate([
    body("username", "Username must not be empty")
      .exists(),
    body("password", "Password must not be empty").exists().notEmpty(),
  ]),
  authController.loginWithUsernameandPassword
);



module.exports = router;
