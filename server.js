const express = require("express");
const hbs = require("hbs");
const multer = require("multer");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();

const accountsRouter = require("./routes/accountsRouter.js");
const profileRouter = require("./routes/profileRouter.js");
const postsRouter = require("./routes/postsRouter.js");
const peopleRouter = require("./routes/peopleRouter.js");
const aboutRouter = require("./routes/aboutRouter.js");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + "/views/partials");

const filter = function (request, file, cb) {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(
  multer({ dest: "public/uploads", fileFilter: filter }).single("filedata")
);
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/accounts", accountsRouter);
app.use("/profile", profileRouter);
app.use("/posts", postsRouter);
app.use("/people", peopleRouter);
app.use("/about", aboutRouter);


app.use(function (req, res, next) {
  res.status(404).send("Not Found");
});

app.listen(8082);
