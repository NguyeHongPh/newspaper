const express = require("express");
const router = express.Router();
/* GET users listing. */
const {
  getArticles,
  getArticlesByTitles,
  getArticlesByLabel,
  updatedArticle,
  createArticle,
  deleteArticle,
} = require("../controllers/article.controller");


router.post("/", createArticle);

router.get("/title", getArticlesByTitles);

router.get("/label", getArticlesByLabel);

router.get("/", getArticles);

router.put("/:id", updatedArticle);


router.delete("/:id", deleteArticle);





module.exports = router;
