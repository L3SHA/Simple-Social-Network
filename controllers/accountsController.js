const mysql = require("mysql2");
const database = {
  host: "localhost",
  user: "root",
  database: "social_network",
  password: "root",
};

exports.isUserExists = function (request, response) {
  const connection = mysql.createConnection(database);
  const email = request.body.email;
  const password = request.body.password;
  const queryAccounts =
    "SELECT email FROM accounts WHERE email = " +
    "'" +
    email +
    "'" +
    " AND password = " +
    "'" +
    password +
    "'";

  connection.execute(queryAccounts, (error, results) => {
    if (results.length != 0) {
      response.cookie("email", email).redirect("/profile");
    } else {
      response.render("sign_in.hbs", { isInvalid: true });
    }
  });

  connection.end();
};

exports.addNewAccount = function (request, response) {
  const connection = mysql.createConnection(database);
  const queryInsertAccount = "INSERT INTO accounts SET ?";

  const first_name = request.body.first_name;
  const second_name = request.body.second_name;
  const email = request.body.email;
  const password = request.body.password;
  const birth_date = request.body.birth_date;
  const profile_photo_path = request.file.filename;
  const account = {
    email,
    password,
    first_name,
    second_name,
    birth_date,
    profile_photo_path,
  };

  connection.query(queryInsertAccount, account, 
    (error, results) => {
    if (error) {
      response.render("sign_up.hbs", { isEmailExists: true });
    } else {
      response.cookie("email", email).redirect("/profile");
    }
  });

  connection.end();

};

exports.getSignInForm = function (request, response) {
  response.render("sign_in.hbs", { isInvalid: false });
};

exports.getSignUpForm = function (request, response) {
  response.render("sign_up.hbs", { isEmailExists: true });
};
