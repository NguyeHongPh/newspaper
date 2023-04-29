const express = require("express");
const { router } = require("../app");
const jwt = require("jsonwebtoken");
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/user');

app.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ name: username });
    if (!user) {
      return res.status(401).send('Username or password incorrect');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Username or password incorrect');
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    refreshTokens.push(refreshToken);

    res.json({
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
});

function generateAccessToken(user) {
  return jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
  return jwt.sign({ name: user.name }, process.env.REFRESH_TOKEN_SECRET);
}

  app.post('/token', (req, res) => {
    const { token } = req.body;
  
    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }
  
    if (!refreshTokens.includes(token)) {
      return res.status(403).json({ message: "Invalid token" });
    }
  
    jwt.verify(token, refreshTokenSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token verification failed" });
      }
  
      const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
  
      res.json({ accessToken });
    });
  });
  
  app.post('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);
    res.json({ message: "Logout successful" });
  });
module.exports = router