var crypto = require('crypto')
const path = require('path')
require('dotenv').config();


var connectionjs = require('../connection.js');
var connection = connectionjs.connection;

module.exports.login = function(req, res){

    console.log('POST request - login')

    var mykey = crypto.createDecipher('aes-128-cbc', process.env.CIPHER_SECRET);

    var username = req.body.username;
    var password = req.body.password;



    connection.query('SELECT * from users WHERE user_name = ?', [username], function(error, results, fields){
        if (error){
            console.log('sql err')
            return res.redirect('/error?status=Internal Server Error')
        }

        if (results.length > 0){
            mykey.update(results[0].password,'hex','utf8');
            decString = mykey.final('utf8');

            if (password == decString){
                req.session.userid = results[0].id;
                return res.redirect('/home');
            }else{
                return res.redirect('/?status=404');
            }

        }else{

            return res.redirect('/?status=404');
        }

    });




}


//insert into users (first_name, last_name, user_name, password, created)