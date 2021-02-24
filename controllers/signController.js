const mysql = require("mysql2");
const dbUtils = require("../utils/dbUtils");
const pageNameUtils = require("../utils/pageNamesUtils");

const COOKIE_EMAIL_KEY = "email";

exports.sign = function (request, response) {
  response.render(pageNameUtils.SIGN_PAGE_NAME, { isIncorrectEmailOrPassword: false, isEmailExists: false });
};

exports.isAccountExists = function (request, response) {
  const connection = mysql.createConnection(dbUtils.database).promise();
  const email = request.body.email;
  const password = request.body.password;

  connection.query(dbUtils.QUERY_ACCOUNT_BY_EMAIL_AND_PASSWORD, [email, password])
    .then(result => {
      if (result.length != 0) { response.cookie(COOKIE_EMAIL_KEY, email).redirect("/" + pageNameUtils.PROFILE_PAGE_ROUTE); return }
      response.render(pageNameUtils.PROFILE_PAGE_ROUTE, { isIncorrectEmailOrPassword: true, isEmailExists: false });
      connection.end();
    });
};

exports.addNewAccount = function (request, response) {
  const connection = mysql.createConnection(dbUtils.database).promise();

  const first_name = request.body.first_name;
  const second_name = request.body.second_name;
  const email = request.body.email;
  const password = request.body.password;
  const profile_photo_path = null;
  const year = request.body.year;
  const month = request.body.month;
  const date = request.body.date;
  const gender = request.body.sex;
  const birth_date = new Date(year, month, date);
  
  const account = {
    email,
    password,
    first_name,
    second_name,
    birth_date,
    profile_photo_path,
    gender
  };

  connection.query(dbUtils.QUERY_INSERT_ACCOUNT, account)
    .then(result => {
      response.cookie(COOKIE_EMAIL_KEY, email).redirect("/" + pageNameUtils.PROFILE_PAGE_ROUTE);
      connection.end();
    })
    .catch(error => {
      response.render(pageNameUtils.SIGN_PAGE_NAME, { isEmailExists: true, isIncorrectEmailOrPassword: false });
      connection.end();
    });
  

}
