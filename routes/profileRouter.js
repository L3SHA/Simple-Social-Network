const express = require("express");
const profileController = require("../controllers/profileController.js");
const profileRouter = express.Router();
 
profileRouter.get("/", profileController.profile);
 
module.exports = profileRouter;