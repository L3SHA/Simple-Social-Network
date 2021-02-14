exports.database = {
    host: "localhost",
    user: "root",
    database: "social_network",
    password: "root",
  };

exports.QUERY_ACCOUNT_BY_EMAIL = 
  "SELECT * " + 
  "FROM accounts " + 
  "WHERE email = ?";

exports.QUERY_ALL_ACCOUNTS = 
  "SELECT first_name, second_name, profile_photo_path " + 
  "FROM accounts " +
  "WHERE email <> ?";

exports.QUERY_POSTS_BY_ACCOUNT = 
  "SELECT * " +
  "FROM posts " +
  "LEFT JOIN accounts ON posts.account_email = accounts.email " + 
  "LEFT JOIN files ON files.post_id = posts.id " + 
  "WHERE email = ? " + 
  "ORDER BY posts.date_time DESC";

exports.QUERY_INSERT_ACCOUNT =
  "INSERT INTO accounts SET ?";

exports.QUERY_INSERT_POST = 
  "INSERT INTO posts SET ?";

exports.QUERY_INSERT_FILE = 
  "INSERT INTO files SET ?";

exports.QUERY_ACCOUNT_BY_EMAIL_AND_PASSWORD =
  "SELECT email FROM accounts WHERE email = ? " +
  "AND password = ?";
