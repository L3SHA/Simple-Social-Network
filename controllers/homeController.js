//TODO: add logout function
//TODO: add image load in post
//TODO: add photo change
//TODO: add suggections on profile page and limit by 5 (in home too)
//TODO: add edit personal data
//TODO: add extra data fields and db tables or columns
const mysql = require("mysql2");
const dbUtils = require("../utils/dbUtils");
const pathUtils = require("../utils/pathUtils");
const pageNamesUtils = require("../utils/pageNamesUtils");

function getTimePassedString(date_time){
    let time = new Date(date_time);
    let timeDiff = Date.now() - time;
    let timePassedDays = Math.round(timeDiff / (1000 * 60 * 60 * 24));
    if (timePassedDays) {return `${timePassedDays} day(s) ago`}
    let timePassedHours = Math.round(timeDiff / (1000 * 60 * 60));
    if (timePassedHours) {return `${timePassedHours} hour(s) ago`}
    let timePassedMinutes = Math.round(timeDiff / (1000 * 60));
    if (timePassedMinutes) {return `${timePassedMinutes} minute(s) ago`}
    let timePassedSeconds = Math.round(timeDiff / 1000);
    if (timePassedSeconds) {return `${timePassedSeconds} second(s) ago`}
    return `just now`
}

function getCurrentTime(){
    let date_time = new Date();
    date_time =
        date_time.getUTCFullYear() +
        "-" +
        `${date_time.getUTCMonth()+ 1 }`+
        "-" +
        date_time.getUTCDate() +
        " " +
        `${date_time.getUTCHours()}` +
        ":" +
        date_time.getUTCMinutes() +
        ":" +
        date_time.getUTCSeconds();
    return date_time;
}

exports.home = function(request, response){

    const email = request.cookies.email;

    if(!email){
        response.redirect(pageNamesUtils.SIGN_PAGE_ROUTE);
        return;
    }

    const connection = mysql.createConnection(dbUtils.database).promise();
    let account = {};
    let posts = {};
    let accounts = {};
    connection.query(dbUtils.QUERY_ACCOUNT_BY_EMAIL, email)
        .then(result => {
            account = result[0][0];
            account.profile_photo_path = pathUtils.resolvePathToImage(account.profile_photo_path);
            return connection.query(dbUtils.QUERY_POSTS_BY_ACCOUNT, email);
        })
        .then(result => {
            posts = result[0].map(post => {
                post.time_passed = getTimePassedString(post.date_time);
                post.profile_photo_path = pathUtils.resolvePathToImage(post.profile_photo_path);
                post.path = post.path ? pathUtils.USER_LOGO_PATH + post.path : undefined;//pathUtils.resolvePathToImage(post.path);
                return post;
            });
            return connection.query(dbUtils.QUERY_ALL_ACCOUNTS, email);
        })
        .then(result => {
            accounts = result[0].map(account =>{
                account.profile_photo_path = pathUtils.resolvePathToImage(account.profile_photo_path);
                return account;
            });
            response.render(pageNamesUtils.HOME_PAGE_NAME, {account, posts, accounts});
            return connection.end();
        }) 
}

exports.createPost = function(request, response){

  const account_email = request.cookies.email;

  if(!account_email){
    response.redirect(pageNamesUtils.SIGN_PAGE_ROUTE);
  }

  const connection = mysql.createConnection(dbUtils.database).promise();
  const text = request.body.text;
  const date_time = getCurrentTime();
  const post = {
    account_email,
    text,
    date_time,
  };

  connection.query(dbUtils.QUERY_INSERT_POST, post)
    .then (result => {
        if(request.file){
            console.log(result[0]);
            const post_id = result[0].insertId;
            const path = request.file.filename;
            const file = {
                post_id,
                path
            }
            connection.query(dbUtils.QUERY_INSERT_FILE, file);
            connection.end();
        }
        response.redirect(pageNamesUtils.HOME_PAGE_ROUTE);
    });
        
}