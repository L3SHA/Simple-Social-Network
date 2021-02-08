const mysql = require("mysql2");
const database = {
  host: "localhost",
  user: "root",
  database: "social_network",
  password: "root",
};

exports.people = function (request, response) {
  const connection = mysql.createConnection(database);

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
