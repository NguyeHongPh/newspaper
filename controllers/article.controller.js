const {
  sendResponse,
  AppError
} = require("../helpers/utils");
const article = require("../models/Article");
const validator = require("../middleware/validator")
const articleController = {};

articleController.getArticles = async (req, res, next) => {
  const filter = {
      isDeleted: false
  };
  let { page } = req.query;
  page = parseInt(page) || 1;
  const limit = 10;
  let offset = limit * (page - 1);
  try {
      const listOfArticle = await article.find(filter);
      const result = listOfArticle.slice(offset, offset + limit);
      const total = listOfArticle.length;
      res.status(200).send({
          success: true,
          article: result,
          message: "Get all articles successfully",
          page: page,
          total: total,
      });
  } catch (err) {
      console.log(err);
      res.status(500).send({
          success: false,
          data: null,
          message: err.message
      });
  }
}
const validArticleLabels = [
    "Politics",
    "Sports",
    "News",
    "Weather",
    "Technology",
    "Entertainment",
];
articleController.getArticlesByLabel = async (req, res, next) => {
    try {
      const label = req.params.labelname;
      if (!label || typeof label !== "string" || !validArticleLabels.includes(label)) {
        throw new Error("Invalid label parameter");
      }
      const labelRegex = new RegExp(label, 'i');
      const articles = await article.find({ label: labelRegex, isDeleted: false });
  
      if (articles.length === 0) {
        console.log(`No articles found with the label '${label}'`);
        return res.status(200).send({
          success: true,
          message: "No articles found with this label",
          label: label
        });
      }
  
      console.log(`Found ${articles.length} articles with the label '${label}':`, articles);
  
      res.status(200).send({
        success: true,
        articles: articles,
        message: "Get articles by label successfully",
        label: label
      });
    } catch (error) {
      next(error);
    }
  };
  
  

articleController.createArticle = async (req, res, next) => {
  try {
      const {
          title,
          label,
          content,
          authorname
      } = req.body;

      // Check if the current user is an admin
      const currentUser = req.user;
      if(!currentUser || currentUser.role !== "admin") {
          return sendResponse(res, 401, false, null, "Only admin user can perform this action", "Unauthorized");
      }

      // Check if any required fields are missing
      if(!title)
          throw new AppError(400, "title missing", "Bad request");
      if(!authorname)
          throw new AppError(400, "title missing", "Bad request");
      if(!label)
          throw new AppError(400, "label missing", "Bad request");
      if(!content)
          throw new AppError(400, "Missing content.", "Bad request");
      // Check if the label array has more than two elements
      const labelArray = Array.isArray(label) ? label : label.split(",");
      if(labelArray.length > 1) {
          const error = new Error("Article can only have one type.");
          error.statusCode = 400;
          throw error;
      }

      // Check if all the labels are valid
      
      const allLabelsValid = labelArray.every((type) =>
          validArticleLabels.includes(type)
      );
      if(!allLabelsValid)
          throw new AppError(400, "Article's label is invalid.", "Bad request");
      // Check if the article already exists in the database
      const existingArticle = await article.findOne({
          $or: [{
              title
          }, {
              content
          }]
      });
      if(existingArticle) {
          const message = existingArticle.title === title ? "The article already exists." : "The content already exists.";
          throw new AppError(400, message, "Bad request");
      }

      // Create the new article in the database
      const createdArticle = await article.create({
          title,
          label,
          content
      });

      // Send the new article as a response
      res.status(201).send(createdArticle);
  } catch (error) {
      next(error);
  }
};


const allowedUpdates = new Set(['title', 'label', 'authorname', 'content']);

articleController.updatedArticle = async (req, res, next) => {
  try {
      const currentUser = req.user;
      if(!currentUser || currentUser.role !== "admin") {
          return sendResponse(res, 401, false, null, "Only admin user can perform this action", "Unauthorized");
      }
      const {
          id
      } = req.params;
      const updates = req.body;
      const invalidUpdates = Object.keys(updates).filter(key => !allowedUpdates.has(key));

      if(invalidUpdates.length) {
          throw new AppError(400, 'Invalid update field', 'Bad request');
      }

      const updatedArticle = await article.findByIdAndUpdate(id, updates, {
          new: true
      });

      if(!updatedArticle) {
          throw new AppError(404, 'Article not found', 'Not found');
      }

      sendResponse(res, 200, true, {
          data: updatedArticle
      }, null, 'Article updated successfully!');
  } catch (error) {
      next(error);
  }
};

articleController.deleteArticle = async (req, res, next) => {
  const {
      id
  } = req.params;

  try {
      const currentUser = req.user;

      if(!currentUser || currentUser.role !== 'admin') {
          throw new AppError(403, "Only admin user can perform this action", "Forbidden");
      }

      if(!validator.checkObjectId(id)) {
          throw new AppError(400, "Invalid article ID", "Bad request");
      }

      const deletedArticle = await article.findByIdAndDelete({
          _id: id
      });

      if(!deletedArticle) {
          return next(new Error("Article not found", "Not found"))
      }

      sendResponse(res, 200, true, null, "Article deleted successfully");
  } catch (error) {
      next(error);
  }
};



module.exports = articleController;