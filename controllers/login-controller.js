var crypto = require('crypto')
require('dotenv').config();


var connectionjs = require('../connection.js');
var connection = connectionjs.connection;

module.exports.login = function(req, res){

    console.log('POST request - login')

    var mykey = crypto.createDecipher('aes-128-cbc', process.env.CIPHER_SECRET);

    var username = req.body.username;
    var password = req.body.password;


    console.log('user: '+username);
    console.log('pass: '+password);


}