var crypto = require('crytpo')

var connectionjs = require('../connection.js');
var connection = connectionjs.connection;

module.exports.login = function(req, res){

    console.log('POST request - login')

    var mykey = crypto.createDecipher('aes-128-cbc', 'dce25323d26aeee195423b8ee3c132d3');

    var username = req.body.username;
    var password = req.body.password;


    console.log('user: '+username);
    console.log('pass: '+password);


}