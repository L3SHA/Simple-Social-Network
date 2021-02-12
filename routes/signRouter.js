const express = require("express");
const signController = require("../controllers/signController.js");
const signRouter = express.Router();
 
signRouter.get("/", signController.sign);
signRouter.use("/isUserExists", signController.isUserExists);
signRouter.post("/addNewAccount", signController.addNewAccount); 

module.exports = signRouter;