require('dotenv').config();
var con = require('../connection.js');

var connection = con.connection;



module.exports.search = function(req,res){
    console.log('POST request - search');

    if (!req.body.username || req.body.username == ''){
        return res.redirect('/home');
    }

    var username = req.body.username;

    var runsql = 'SELECT user_name FROM users WHERE user_name = \''+req.body.user_name+'\'';

    connection.query(runsql, function(error,results,fields){
        if (error){
            return res.redirect('/error?status=Internal 2Server Error')
        }

        //the username already exists 
        //send status 406
        if (results.length == 0){
            return res.redirect('/searchuser?status=404');
        }else{
            // connection.query('INSERT INTO users SET ?', user, function (err,results1,fields1){
            //     if (err){
            //         console.log(err);
            //         return res.redirect('/error?status=Internal 3Server Error')
            //     }

            //     return res.redirect('/?status=200');
            // });
        }

    });

}