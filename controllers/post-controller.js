require('dotenv').config();
var con = require('../connection.js');

var connection = con.connection;



module.exports.post = function(req,res){
    console.log('POST request - post');

    

    var uid = req.session.userid;
    var currDate = new Date();

    var postData ={
        "id": uid,
        "textData": req.body.textdata,
        "spotify": req.body.embedcode,
        "created": currDate,
        "title": req.body.title
    }
    

    connection.query('INSERT INTO posts SET ?',postData, function(error,results,fields){
        if (error){
            return res.redirect('/error?status=Internal Server Error')
        }

        return res.redirect('/home?message=Song Posted!');

    });

}