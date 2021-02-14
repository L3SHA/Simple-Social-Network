const express = require("express");
const signController = require("../controllers/signController.js");
const signRouter = express.Router();
 
signRouter.get("/", signController.sign);
signRouter.post("/isAccountExists", signController.isAccountExists);
signRouter.post("/addNewAccount", signController.addNewAccount); 

module.exports = signRouter;