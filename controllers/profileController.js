const mysql = require("mysql2");
const dbUtils = require("../utils/dbUtils");
const pathUtils = require("../utils/pathUtils");
const pageNamesUtils = require("../utils/pageNamesUtils");

exports.profile = function (request, response) {
  const connection = mysql.createConnection(dbUtils.database);
  const queryAccount =
    "SELECT * FROM accounts WHERE email = " + "'" + request.cookies.email + "'";

  connection.execute(queryAccount, (error, results) => {
    if (results.length != 0) {
      const account = results[0];
      const str = "" + account.birth_date;
      account.birth_date = str.substr(3, 12);

      account.profile_photo_path = account.profile_photo_path
        ? pathUtils.USER_LOGO_PATH + account.profile_photo_path
        : pathUtils.DEFAULT_LOGO_PATH;

      response.render(pageNamesUtils.PROFILE_PAGE, { account });
    } else {
      response.send(error); //There can be problem, when we can't find the user or some database problem
    }
  });

  connection.end();
}
