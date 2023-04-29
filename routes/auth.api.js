const express = require('express');
const router = express.Router();
const app = express();
const { body } = require("express-validator");
const bodyParser = require('body-parser')
const validators = require("../middleware/validator");
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

const authController = require('../controllers/auth.controller');


// Route URL added to the route definition
router.post("/login", 
  [
    body("email").exists().isEmail().withMessage('Invalid email format'),
    body("password").notEmpty().withMessage('Password cannot be empty'),
  ],
  authController.loginWithemailandPassword
);

module.exports = router;




module.exports = router;
