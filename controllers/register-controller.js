require('dotenv').config();
const crypto = require('crypto');
var con = require('../connection.js');


var connection = con.connection;



module.exports.register = function(req,res){
    console.log('POST request - register');

    var mykey = crypto.createCipher('aes-128-cbc',process.env.CIPHER_SECRET);

    //check password
    var pass = req.body.password;
    if (pass.length < 8){
        //error
        return res.redirect('/register?status=406');
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

    var friendData = [req.body.user_name];

    

    var user = {
        "first_name":req.body.first_name,
        "last_name":req.body.last_name,
        "user_name":req.body.user_name,
        "password":encStr,
        "created":currDate,
        "friends":JSON.stringify(friendData)
    }

    var runsql = 'SELECT user_name FROM users WHERE user_name = \''+req.body.user_name+'\'';

    connection.query(runsql, function(error,results,fields){
        if (error){
            return res.redirect('/error?status=Internal 2Server Error')
        }

        //the username already exists 
        //send status 406
        if (results.length > 0){
            return res.redirect('/register?status=409');
        }else{
            connection.query('INSERT INTO users SET ?', user, function (err,results1,fields1){
                if (err){
                    console.log(err);
                    return res.redirect('/error?status=Internal 3Server Error')
                }

                return res.redirect('/?status=200');
            });
            //return res.redirect('/error?status=Internal Server Error')
        }

    });
    

}