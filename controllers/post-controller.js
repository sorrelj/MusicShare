require('dotenv').config();
var con = require('../connection.js');

var connection = con.connection;



module.exports.post = function(req,res){
    console.log('POST request - post');

    console.log(req.body);
    console.log(req.session.userid)
    return res.redirect('/home');

    var username = req.body.username;
    var uid = req.session.userid;

    var runsql = 'SELECT friends FROM users WHERE id = \''+uid+'\'';

    connection.query(runsql, function(error,results,fields){
        if (error){
            return res.redirect('/error?status=Internal Server Error')
        }

        var newJSON = [];
        var resp;
        if (results[0].friends == null){
            newJSON.push(username);

            resp = JSON.stringify(newJSON);
        }else{
            newJSON = JSON.parse(results[0].friends);
            newJSON.push(username);

            resp = JSON.stringify(newJSON);
        }

        var q2 = 'UPDATE users SET friends=\''+resp+'\' WHERE id='+uid;
        connection.query(q2, function(error,results,fields){
            if (error){
                return res.redirect('/error?status=Internal Server Error')
            }
            return res.redirect('/home?message=Following '+username);
        });

    });

}