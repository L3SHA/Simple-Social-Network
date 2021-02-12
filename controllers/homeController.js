const mysql = require("mysql2");
const dbUtils = require("../utils/dbUtils");
const pathUtils = require("../utils/pathUtils");
const pageNamesUtils = require("../utils/pageNamesUtils");

exports.home = function(request, response){

    if(request.cookies.email){
        const connection = mysql.createConnection(dbUtils.database).promise();
        const queryAccount =
            "SELECT first_name, second_name, profile_photo_path FROM accounts WHERE email = " + "'" + request.cookies.email + "'";
        const queryPosts = 
            //"SELECT text, date_time FROM posts WHERE account_email = " + "'" + request.cookies.email + "'" + "ORDER BY date_time DESC";
            "select * from posts left join accounts on posts.account_email = accounts.email left join files on files.post_id = posts.id where email = " + "'" + request.cookies.email + "'" + "order by posts.date_time desc";
        const queryAllAccounts =
            "SELECT first_name, second_name, profile_photo_path FROM accounts WHERE email <> " +
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
                        console.log(Math.round(timeDiff));
                        post.time_passed = Math.round(timeDiff) + "hr ago";
                        post.profile_photo_path = post.profile_photo_path
                            ? pathUtils.USER_LOGO_PATH + post.profile_photo_path
                            : pathUtils.DEFAULT_LOGO_PATH;
                        post.path = post.path
                        ? pathUtils.USER_LOGO_PATH + post.path
                        : pathUtils.DEFAULT_LOGO_PATH;
                        return post;
                    });
                    console.log(posts);
                    
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
                    console.log(accounts);

                    response.render(pageNamesUtils.HOME_PAGE, {account, posts, accounts});
                    connection.end();
                })
        });     
    }else{
        response.redirect("/accounts/signin");
    }
}

exports.createPost = function(request, response){
  const connection = mysql.createConnection(dbUtils.database);
  const queryInsertPost = "INSERT INTO posts SET ?";
  const queryInsertFile = "INSERT INTO files SET ?";
  console.log(request.file.filename);
  const account_email = request.cookies.email;
  const text = request.body.text;
  //const path = request.body.file.filename;
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
    pad(date_time.getUTCHours()) +
    ":" +
    pad(date_time.getUTCMinutes()) +
    ":" +
    pad(date_time.getUTCSeconds());

  const post = {
    account_email,
    text,
    date_time,
  };

  console.log("shit happenes");

  connection.query(queryInsertPost, post, (error, results) => {
    if (error) {
        
        
      //response.render("sign_up.hbs", { isEmailExists: true });
    } else {
        if(request.file){
            const post_id = results.insertId;
            const path = request.file.filename;
            const file = {
                post_id,
                path
            }
            connection.query(queryInsertFile, file, (error, results) => {response.redirect("/home"); connection.end();});
        }
      //
    }
  });

//   connection.end();
//     if(request.cookies.email){
//         response.render("home.hbs");
//     }else{
//         response.redirect("/accounts/signin");
//     }
}