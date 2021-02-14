const mysql = require("mysql2");
const dbUtils = require("../utils/dbUtils");
const pathUtils = require("../utils/pathUtils");
const pageNamesUtils = require("../utils/pageNamesUtils");

exports.profile = function (request, response) {

  const email = request.cookies.email;

  if(!email){
    response.redirect(pageNamesUtils.SIGN_PAGE_ROUTE);
    return;
  }

  const connection = mysql.createConnection(dbUtils.database).promise();

  connection.query(dbUtils.QUERY_ACCOUNT_BY_EMAIL, email)
    .then(result => {
      const account = result[0][0];
      account.birth_date = account.birth_date.toString().substr(3, 12);
      account.profile_photo_path = pathUtils.resolvePathToImage(account.profile_photo_path);
      response.render(pageNamesUtils.PROFILE_PAGE_NAME, { account });
      connection.end();
    });
  
}
