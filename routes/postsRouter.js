const express = require("express");
const postsController = require("../controllers/postsController.js");
const postsRouter = express.Router();
 
postsRouter.use("/", postsController.posts);

module.exports = postsRouter;