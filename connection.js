const mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'musicshareapp.ccaamclrfsyt.us-east-2.rds.amazonaws.com',
    user: 'sorrelj',
    password: '!sorrelj29',
    database: 'musicshare'
})

connection.connect(function(err){
    if (err){
        console.log('error connecting to database');
    }
    console.log('Connected to mysql id: ' + connection.threadId);
});


//export
module.exports.connection = connection;