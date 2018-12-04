require('dotenv').config();
var con = require('../connection.js');

var connection = con.connection;



module.exports.post = function(req,res){
    console.log('POST request - post');

    

    var uid = req.session.userid;
    var currDate = new Date();

    connection.query('SELECT user_name from users where id=?',req.session.userid, function(error,results,fields){
        var username = results[0].user_name;

        var postData ={
            "id": uid,
            "textData": req.body.textdata,
            "spotify": req.body.embedcode,
            "created": currDate,
            "user": username,
            "title": req.body.title
        }
        

        connection.query('INSERT INTO posts SET ?',postData, function(error,results,fields){
            if (error){
                return res.redirect('/error?status=Internal Server Error')
            }

            return res.redirect('/home?message=Song Posted!');

        });
    });
}