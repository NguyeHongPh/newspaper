const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authenticator");
/* GET users listing. */
const {
  getArticles,
  getArticlesByTitles,
  getArticlesByLabel,
  updatedArticle,
  createArticle,
  deleteArticle,
} = require("../controllers/article.controller");

router.get("/label", authMiddleware.loginRequired,getArticlesByLabel);

router.get("/", authMiddleware.loginRequired, getArticles);

router.get("/:title", authMiddleware.loginRequired, getArticlesByTitles);

router.post("/", authMiddleware.loginRequired, createArticle);

router.put("/:id", authMiddleware.loginRequired, updatedArticle);


router.delete("/:id", authMiddleware.loginRequired, deleteArticle);





module.exports = router;
