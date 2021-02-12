const mysql = require("mysql2");
const dbUtils = require("../utils/dbUtils");
const pathUtils = require("../utils/pathUtils");
const pageNamesUtils = require("../utils/pageNamesUtils");

exports.home = function(request, response){

    if(request.cookies.email){
        const connection = mysql.createConnection(dbUtils.database).promise();
        const queryAccount =
            "SELECT first_name, second_name, profile_photo_path " + 
            "FROM accounts " + 
            "WHERE email = " + "'" + request.cookies.email + "'";
        const queryPosts = 
            "SELECT * " +
            "FROM posts " +
            "LEFT JOIN accounts ON posts.account_email = accounts.email " + 
            "LEFT JOIN files ON files.post_id = posts.id " + 
            "WHERE email = " + "'" + request.cookies.email + "' " + 
            "ORDER BY posts.date_time DESC";
        const queryAllAccounts =
            "SELECT first_name, second_name, profile_photo_path " + 
            "FROM accounts WHERE email <> " +
            "'" +
            request.cookies.email +
            "'";
        let account = {};
        let posts = {};
        connection.query(queryAccount)
            .then(result => {
                account = result[0][0];
                account.profile_photo_path = account.profile_photo_path
                    ? pathUtils.USER_LOGO_PATH + account.profile_photo_path
                    : pathUtils.DEFAULT_LOGO_PATH;
        }).then(() => {
            connection.query(queryPosts)
                .then(result => {
                    posts = result[0].map(post =>{
                        let time = new Date(post.date_time);
                        let timeDiff = (Date.now() - time) / (1000 * 60 * 60);
                        post.time_passed = Math.round(timeDiff) + "hr ago";
                        post.profile_photo_path = post.profile_photo_path
                            ? pathUtils.USER_LOGO_PATH + post.profile_photo_path
                            : pathUtils.DEFAULT_LOGO_PATH;
                        post.path = post.path
                            ? pathUtils.USER_LOGO_PATH + post.path
                            : pathUtils.DEFAULT_LOGO_PATH;
                        return post;
                    });
            });
        }).then(() => {
            connection.query(queryAllAccounts)
                .then(result => {
                    const accounts = result[0].map(account =>{
                        account.profile_photo_path = account.profile_photo_path
                            ? pathUtils.USER_LOGO_PATH + account.profile_photo_path
                            : pathUtils.DEFAULT_LOGO_PATH;
                        return account;
                    });

                    response.render(pageNamesUtils.HOME_PAGE, {account, posts, accounts});
                    connection.end();
                })
        });     
    }else{
        response.redirect("/accounts/signin");
    }
}

exports.createPost = function(request, response){

  if(!request.cookies.email){
    response.redirect("/accounts/signin");
  }

  const connection = mysql.createConnection(dbUtils.database);
  const queryInsertPost = "INSERT INTO posts SET ?";
  const queryInsertFile = "INSERT INTO files SET ?";
 
  const account_email = request.cookies.email;
  const text = request.body.text;
  const pad = function (num) {
    return ("00" + num).slice(-2);
  };
  let date_time = new Date();
  date_time =
    date_time.getUTCFullYear() +
    "-" +
    pad(date_time.getUTCMonth() + 1) +
    "-" +
    pad(date_time.getUTCDate()) +
    " " +
    pad(date_time.getUTCHours() + 3) +
    ":" +
    pad(date_time.getUTCMinutes()) +
    ":" +
    pad(date_time.getUTCSeconds());

  const post = {
    account_email,
    text,
    date_time,
  };

  connection.query(queryInsertPost, post, (error, results) => {
    if (error) {
        console.log(error);
    } else {
        if(request.file){
            const post_id = results.insertId;
            const path = request.file.filename;
            const file = {
                post_id,
                path
            }
            connection.query(queryInsertFile, file, (error, results) => { 
                connection.end();
            });
        }else{
            connection.end();
        }
        response.redirect("/home");
    }
  });
}