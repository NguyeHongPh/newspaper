const { sendResponse, AppError } = require("../helpers/utils");
const article = require("../models/Article");
const validator = require("../middleware/validator")
const articleController = {};

articleController.getArticles = async (req, res, next) => {
  const filter = { isDeleted: false };
  const { title } = req.query;
  title ? (filter.title = title) : null;
try {
  const listOfArticle = await article.find(filter);
  res.status(200).send({
    success: true,      
    data: listOfArticle,
    message: "Get all articles successfully",
  });
} catch (err) {
  console.log(err);
  res.status(500).send({ success: false, data: null, message: err.message });
}
}



  
  async function readArticleData() {
    const articles = await article.find({});
    return articles;
  }
  
  async function findArticleByTitle(titleParam, allArticles) {
    const title = titleParam.toLowerCase();
    return allArticles.find(article => article.title.toLowerCase() === title);
  }
  
  articleController.getArticlesByTitles = async (req, res, next) => {
    try {
      
      const allArticles = await readArticleData();
      const result = await findArticleByTitle(req.params.title, allArticles);
      if (result) {
        const { _id, title, labels } = result;
        const article = { id: _id, title, labels };
        return res.status(200).send(article);
      } else {
        return res.status(404).send(`No article found with title ${req.params.title}`);
      }
    } catch (error) {
      next(error);
    }
  };
  
    articleController.getArticlesByLabel = async (req, res, next) => {
      try {
        const label = req.params.label;
        if (!label) {
          throw new Error("label parameter is missing or invalid");
        }
        const labelRegex = new RegExp(label, 'i');
        const result = await article.find({ labels: labelRegex });
        res.status(200).send(result);
      } catch (error) {
        next(error);
      }
    };

    articleController.createArticle = async (req, res, next) => {
      try {
        const { title, label, content } = req.body;
    
        // Check if the current user is an admin
        const currentUser = req.user;
        if (!currentUser || currentUser.role !== "admin") {
          return sendResponse( res,401,false,null,"Only admin user can perform this action", "Unauthorized");
        }
    
        // Check if any required fields are missing
        if (!title)
          throw new AppError(400, "title missing", "Bad request");
        if (!label)
          throw new AppError(400, "label missing", "Bad request");
        if (!content)
          throw new AppError(400, "Missing content.", "Bad request");
        // Check if the label array has more than two elements
        const labelArray = Array.isArray(label) ? label : label.split(",");
        if (labelArray.length > 2) {
          const error = new Error("Article can only have one or two types.");
          error.statusCode = 400;
          throw error;
        }
    
        // Check if all the labels are valid
        const validArticleLabels = [
          "Politics",
          "Sports",
          "Breaking News",
          "Weather",
          "Technology",
          "Entertainment",
        ];
        const allLabelsValid = labelArray.every((type) =>
          validArticleLabels.includes(type)
        );
        if (!allLabelsValid)
          throw new AppError(
            400,
            "Article's label is invalid.",
            "Bad request"
          );
        // Check if the article already exists in the database
        const existingArticle = await article.findOne({ title });
        if (existingArticle)
          throw new AppError( 400, "The article already exists.","Bad request");
    
        // Create the new article in the database
        const createdArticle = await article.create({ title, label, content });
    
        // Send the new article as a response
        res.status(201).send(createdArticle);
      } catch (error) {
        next(error);
      }
    };
    
    
    
    

const allowedUpdates = new Set(['name', 'labels', 'authorname','content','status']);

articleController.updatedArticle = async (req, res, next) => {
  try {
    const currentUser = req.user;
        if (!currentUser || currentUser.role !== "admin") {
          return sendResponse( res,401,false,null,"Only admin user can perform this action", "Unauthorized");
        }
    const { id } = req.params;
    const updates = req.body;
    const invalidUpdates = Object.keys(updates).filter(key => !allowedUpdates.has(key));
    
    if (invalidUpdates.length) {
      throw new AppError(400, 'Invalid update field', 'Bad request');
    }

    const updatedArticle = await article.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedArticle) {
      throw new AppError(404, 'Article not found', 'Not found');
    }

    sendResponse(res, 200, true, { data: updatedArticle }, null, 'Article updated successfully!');
  } catch (error) {
    next(error);
  }
};

articleController.deleteArticle = async (req, res, next) => {
  const { id } = req.params;

  try {
      const currentUser = req.user;

      if (!currentUser || currentUser.role !== 'admin') {
          throw new AppError(403, "Only admin user can perform this action", "Forbidden");
      }

      if (!validator.checkObjectId(id)) {
          throw new AppError(400, "Invalid article ID", "Bad request");
      }

      const deletedArticle = await article.findByIdAndDelete({ _id: id });

      if (!deletedArticle) {
          return next(new Error("Article not found", "Not found"))
      }

      sendResponse(res, 200, true, null, "Article deleted successfully");
  } catch (error) {
      next(error);
  }
};


  
  module.exports = articleController;

  