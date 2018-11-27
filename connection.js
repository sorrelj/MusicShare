const mysql = require('mysql')
require('dotenv').config();


var connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_DATA
})

connection.connect(function(err){
    if (err){
        console.log('error connecting to database');
    }
    console.log('Connected to mysql id: ' + connection.threadId);
});


//export
module.exports.connection = connection;