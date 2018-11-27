const express = require('express')
const app = express();
const path = require('path')
var session = require('express-session')
var bodyParser = require('body-parser');

require('dotenv').config();

app.use(express.static('public'))
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

    return res.render(path.join(__dirname+'/views/index.html'))

});

/*
 * / get request
 * 
 */
app.get('/', (req, res) => {
    console.log('/ get request');

    return res.render(path.join(__dirname+'/views/index.html'))

});


/*====================================================================
 *
 *  POST Request
 *
 *====================================================================
 */ 

//login
app.post('/controllers/login-controller', loginController.login)









/*
 * App listen port: 8000
 * 
 */
app.listen(8000, () => {
    console.log("App started on port: 8000")
});