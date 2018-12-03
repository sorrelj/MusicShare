require('dotenv').config();
const crypto = require('crypto');
var con = require('./../connect.js');


var connection = con.connection;



module.exports.register = function(req,res){
    console.log('POST request - register');

    var mykey = crypto.createCipher('aes-128-cbc',process.env.CIPHER_SECRET);

    //check password
    var pass = req.body.password;
    if (pass.length < 8){
        //error
        console.log("PASSWORD ERROR");
        return res.status(403).send("Password must be a least 8 characters");
    }
    var upper = false;
    var lower = false;
    var num = false;
    var chr;
    for (var i = 0; i < pass.length; i++){
        chr = pass.charAt(i);

        if (!isNaN(chr)){
            num = true;
        }else if (chr == chr.toUpperCase()){
            upper = true;
        }else if (chr == chr.toLowerCase()){
            lower = true;
        }
    }

    if (!upper || !lower || !num){
        //error
        //console.log("PASSWORD ERROR: U:"+upper+" L:"+lower+" N:"+num);
        return res.redirect('/register?status=406');
    }

    var currDate = new Date();
    mykey.update(req.body.password,'utf8','hex');
    encStr = mykey.final('hex');
    var user = {
        "first_name":req.body.first_name,
        "last_name":req.body.last_name,
        "user_name":req.body.username,
        "password":encStr,
        "created":currDate
    }

    var runsql = 'SELECT user_name FROM user_creds WHERE user_name = \''+req.body.username+'\'';

    connection.query(runsql, function(error,results,fields){
        if (error){
            return res.redirect('/error?status=Internal Server Error')
        }

        //the username already exists 
        //send status 406
        if (results.length > 0){
            return res.redirect('/register?status=409');
        }


    });
    connection.query('INSERT INTO users SET ?', user, function (error,results,fields){
        
    });

}