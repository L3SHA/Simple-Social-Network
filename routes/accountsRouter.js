const express = require("express");
const accountsController = require("../controllers/accountsController.js");
const accountsRouter = express.Router();
 
accountsRouter.use("/signin", accountsController.getSignInForm); //enter as some user
accountsRouter.use("/signup", accountsController.getSignUpForm); //reg new user
accountsRouter.use("/isUserExists", accountsController.isUserExists);
accountsRouter.use("/addNewAccount", accountsController.addNewAccount); 

module.exports = accountsRouter;