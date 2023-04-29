const { sendResponse, AppError } = require("../helpers/utils");
const article = require("../models/Article");

const articleController = {};
articleController.getArticles = async (req, res) => {
  const filter = {};
  const { title } = req.query;
  title ? (filter.title = title) : null;
  try {
    // Validate inputs
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
    const articles = await Article.find({});
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
        // Get the request body
        const { name, label, description } = req.body;
        const currentUser = req.user;
        if (!currentUser || currentUser.role !== 'admin') {
        throw new AppError(401, "Only admin user can perform this action", "Unauthorized")
        }
        // Check if any required fields are missing
        if (!name || !label || !description)
          throw new AppError(400, "Missing required data.", "Bad request");
    
        // Check if the label array has more than two elements
        if (label.length > 2)
          throw new AppError(400, "Article can only have one or two labels.", "Bad request");
    
        // Check if all the labels are valid
        const validArticleLabels = [
          "Politics",
          "Sports",
          "Breaking News",
          "Weather",
          "Technology",
          "Entertainment",
        ];
        const allLabelsValid = label.every((type) => validArticleLabels.includes(type));
        if (!allLabelsValid)
          throw new AppError(400, "Article's label is invalid.", "Bad request");
    
        // Check if the article already exists in the database
        const existingArticle = await article.findOne({ name });
        if (existingArticle)
          throw new AppError(400, "The article already exists.", "Bad request");
    
        // Create the new article in the database
        const createdArticle = await article.create({ name, label, content });
    
        // Send the new article as a response
        res.status(201).send(createdArticle);
      } catch (error) {
        next(error);
      }
    };
    

const allowedUpdates = new Set(['name', 'labels', 'authorname','content','status']);

articleController.updatedArticle = async (req, res, next) => {
  try {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new AppError(401, "Only admin user can perform this action", "Unauthorized")
      }
    const { id } = req.params;
    const updates = req.body;
    const invalidUpdates = Object.keys(updates).filter(key => !allowedUpdates.has(key));
    
    if (invalidUpdates.length) {
      throw new AppError(400, 'Invalid update field', 'Bad request');
    }

    const updatedArticle = await Article.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedArticle) {
      throw new AppError(404, 'Article not found', 'Not found');
    }

    sendResponse(res, 200, true, { data: updatedArticle }, null, 'Article updated successfully!');
  } catch (error) {
    next(error);
  }
};

  articleController.deleteArticle = async (req, res, next) => { 
    const { id } = req.params;//extract the id from object
    const options = { new: true }; //return the updated document
    try {
      if (!currentUser || currentUser.role !== 'admin') {
        throw new AppError(401, "Only admin user can perform this action", "Unauthorized")
        }
        if (!isValidObjectId(id)) { //check the id is valid or not
            throw new AppError(402, "Article not found", "Bad request");
        }
        const deletedArticle = await article.findByIdAndUpdate(id, { isDeleted: true }, options);
  //method to update the isDeleted property of the article with the given id and returns the updated document.
        sendResponse(res, 200, true, { data: deletedArticle }, null, "Article deleted successfully");
    } 
    catch (error) {//catch any error
        next(error);
    }
  };
  
  module.exports = articleController;

  