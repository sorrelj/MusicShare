const express = require('express')
const app = express();
const path = require('path')
var session = require('express-session')
var bodyParser = require('body-parser');
var request = require('request');
var con = require('./connection.js');

var connection = con.connection;

require('dotenv').config();

app.use('/',express.static(__dirname+ '/public'))
app.engine('html',require('ejs').renderFile)
app.set('view engine','html');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { 
      maxAge: 3600000,
      secure: false
  }
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


/*
 * Controllers
 *  
 */
var loginController = require('./controllers/login-controller');
var registerController = require('./controllers/register-controller');
var searchController = require('./controllers/search-controller');
var followController = require('./controllers/follow-controller');
var postController = require('./controllers/post-controller');



/*====================================================================
 *
 *  GET Requests
 *
 *====================================================================
 */ 

/*
 * / get request
 * 
 */
app.get('/', (req, res) => {
    console.log('/ get request');

    if (req.session.userid){
        return res.redirect('/home');
    }

    if (req.query.status != null && req.query.status != '200'){
        console.log('SEND ERROR');

        //Not found error
        if (req.query.status == '404'){
            return res.render(path.join(__dirname+'/views/index.html'),
            {
                errmsg: 'Username or Password Incorrect'
            });
        }
    }

    return res.render(path.join(__dirname+'/views/index.html'),
    {
        errmsg: ''
    });

});

/*
 * /register get request
 * 
 */
app.get('/register', (req, res) => {
    console.log('/register get request');

    if (req.query.status != null && req.query.status != '200'){
        //user alread exists
        if (req.query.status == '409'){
            return res.render(path.join(__dirname+'/views/register.html'),
            {
                errmsg: 'User Already Exists!'
            });
        //password requiremnets not met
        }else if (req.query.status == '406'){
            return res.render(path.join(__dirname+'/views/register.html'),
            {
                errmsg: 'Password must be at least 8 characters. Must contain at least 1 Uppercase character and a digit (0-9)'
            });
        }
    }

    return res.render(path.join(__dirname+'/views/register.html'),
    {
        errmsg: ''
    });
});

/*
 * /home get request
 * 
 */
app.get('/home', (req, res) => {
    console.log('/home get request');

    if (!req.session.userid){
        console.log('user not authorized');
        return res.redirect('/');
    }

    //console.log(req.session)


    if (req.query.code){
        req.session.spotifyCode = req.query.code;

        var redirect_uri = 'http://localhost:8000/home';

        var authOptions ={
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: req.query.code,
                grant_type: 'authorization_code',
                redirect_uri: redirect_uri
            },
            headers: {
                Authorization: 'Basic ' + (new Buffer(process.env.SPOTIFY_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64'))
            },
            json: true
        }

        //0 = error
        //1 = good set username
        var flag = 0;
        var spotifyToken;
        var display_name;

        request.post(authOptions, function(error, response, body){
            var token = body.access_token;
            //console.log('Token: ' + token)

            spotifyToken = token;

            var options ={
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                json: true
            };

            var uid = req.session.userid;

            request.get(options, function(error,response,body){
                display_name = body.display_name;

                connection.query('UPDATE users SET spotify_username = ? WHERE id=?', [display_name, uid], function (err,results,fields){
                    if (err){
                        console.log(err);
                    }
                    //console.log('added')
                });
            });            

        });
        

    }

    if (req.query.message){
        return res.render(path.join(__dirname+'/views/home.html'),
            {
                msg: req.query.message
            }
        );
    }

    return res.render(path.join(__dirname+'/views/home.html'),
        {
            msg: ''
        }
    );

});

/*
 * /signout get request
 * 
 */
app.get('/signout', (req, res) => {
    console.log('/signout get request');

    if (!req.session.userid){
        return res.redirect('/');
    }

    req.session.destroy();
    return res.redirect('/');

});

/*
 * /error get request
 * 
 */
app.get('/error', (req, res) => {
    if (req.query.status){
        return res.render(path.join(__dirname+'/views/errorPage.html'),
        {
            status: req.query.status
        }
        );
    }else{
        return res.render(path.join(__dirname+'/views/errorPage.html'),
        {
            status: 'Unknown Error'
        }
        );
    }
});

/*
 * /spotifylogin get request
 * 
 */
app.get('/spotifylogin', (req, res) => {

    if (!req.session.userid){
        console.log('user not authorized');
        return res.redirect('/');
    }
    
    var scopes = 'user-read-private user-read-email';
    var redirect_uri = 'http://localhost:8000/home';

    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + process.env.SPOTIFY_ID +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(redirect_uri)
    );


});

/*
 * /searchuser get request
 * 
 */
app.get('/searchuser', (req, res) => {

    if (!req.session.userid){
        return res.redirect('/');
    }

    if (req.query.status != null && req.query.status != '200'){
        //user alread exists
        if (req.query.status == '404'){
            var pth = path.join(__dirname+'/views/search.html');
            return res.render(pth,
            {
                searchdata: '404'
            });
        }
    }

    var pth = path.join(__dirname+'/views/search.html');
    return res.render(pth,
    {
        searchdata: req.query.username
    });

});

/*
 * /feeddata get request
 * 
 */
app.get('/feeddata', (req, res) => {
    console.log('/feeddata get request')

    if (!req.session.userid){
        console.log('not auth');
        return res.redirect('/');
    }



    return res.send();

});


/*
 * /postform get request
 * 
 */
app.get('/postform', (req, res) => {
    console.log('/postform get request')

    if (!req.session.userid){
        return res.redirect('/');
    }



    return res.render(path.join(__dirname+'/views/post.html'));

});

/*====================================================================
 *
 *  POST Request
 *
 *====================================================================
 */ 

//login
app.post('/controllers/login-controller', loginController.login)
app.post('/controllers/register-controller', registerController.register);
app.post('/controllers/search-controller',searchController.search);
app.post('/controllers/follow-controller',followController.follow);
app.post('/controllers/post-controller', postController.post);






/*
 * App listen port: 8000
 * 
 */
app.listen(8000, () => {
    console.log("App started on port: 8000")
});