const express = require("express");
const homeController = require("../controllers/homeController.js");
const homeRouter = express.Router();
 
homeRouter.get("/", homeController.home);
homeRouter.post("/", homeController.createPost);

module.exports = homeRouter;