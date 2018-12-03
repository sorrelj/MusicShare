const express = require('express')
const app = express();
const path = require('path')
var session = require('express-session')
var bodyParser = require('body-parser');

require('dotenv').config();

app.use('/',express.static(__dirname+ '/public'))
app.engine('html',require('ejs').renderFile)
app.set('view engine','html');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


/*
 * Controllers
 *  
 */
var loginController = require('./controllers/login-controller');
var registerController = require('./controllers/register-controller');





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

    return res.render(path.join(__dirname+'/views/home.html'))

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


/*====================================================================
 *
 *  POST Request
 *
 *====================================================================
 */ 

//login
app.post('/controllers/login-controller', loginController.login)
app.post('/controllers/register-controller', registerController.register);








/*
 * App listen port: 8000
 * 
 */
app.listen(8000, () => {
    console.log("App started on port: 8000")
});