const mysql = require('mysql');

const connection = mysql.createConnection({
    "host": "localhost",
    "user": "root",
    "password": "chirag",
    "database" : "redditindia"
});

module.exports = connection;