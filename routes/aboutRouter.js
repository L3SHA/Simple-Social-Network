const express = require("express");
const aboutController = require("../controllers/aboutController.js");
const aboutRouter = express.Router();
 
aboutRouter.use("/", aboutController.about);

module.exports = aboutRouter;