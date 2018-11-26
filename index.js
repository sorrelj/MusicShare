const express = require('express')
const app = express();
const path = require('path')

app.engine('html',require('ejs').renderFile)
app.set('view engine','html');


/*
 * / get request
 * 
 */
app.get('/', (req, res) => {
    console.log('/ get request');

    return res.render(path.join(__dirname+'/views/index.html'))
    
});


/*
 * App listen port: 8000
 * 
 */
app.listen(8000, () => {
    console.log("App started on port: 8000")
});