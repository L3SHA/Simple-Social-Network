const express = require("express");
const peopleController = require("../controllers/peopleController.js");
const peopleRouter = express.Router();
 
peopleRouter.use("/", peopleController.people);

module.exports = peopleRouter;