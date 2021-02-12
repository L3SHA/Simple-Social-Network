const mysql = require("mysql2");
const dbUtils = require("../utils/dbUtils");

exports.people = function (request, response) {
  const connection = mysql.createConnection(dbUtils.database);

  if (request.cookies.email) {
    const queryAllAccounts =
      "SELECT first_name, second_name, profile_photo_path FROM accounts WHERE email <> " +
      "'" +
      request.cookies.email +
      "'";

    connection.execute(queryAllAccounts, (error, results) => {
      console.log(error);
      response.render("people.hbs", { accounts: results });
    });
  } else {
    response.redirect("/accounts/signin", {isInvalid: false});
  }

  connection.end();
};
