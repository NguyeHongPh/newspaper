const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authenticator");
/* GET users listing. */
const {
  getArticles,
  getArticlesByLabel,
  updatedArticle,
  createArticle,
  deleteArticle,
} = require("../controllers/article.controller");
/**
 * @route get /article/label
 * @description get article by label
 * @access Login required
 */
router.get("/label/:labelname", authMiddleware.loginRequired, getArticlesByLabel);
/**
 * @route get /article/
 * @description get all articles
 * @access Login required
 */
router.get("/", authMiddleware.loginRequired, getArticles);
/**
 * @route post /article/
 * @description create an article
 * @access Login and admin role required
 */
router.post("/", authMiddleware.loginRequired, createArticle);
/**
 * @route put /article/id
 * @description change article information
 * @access Login and admin role required
 */
router.put("/:id", authMiddleware.loginRequired, updatedArticle);
/**
 * @route delete /article/id
 * @description delete an article 
 * @access Login and admin role required
 */

router.delete("/:id", authMiddleware.loginRequired, deleteArticle);

module.exports = router;
