/**
 * Created by darac on 7/23/2016.
 */
var express = require('express');

//initialize app
var app = express();

var jwt =  require('express-jwt');

var cors = require('cors');

//Telling app to use CORS
app.use(cors());

//JWT middleware and it's package
// Go to Auth0 site dashboard for details. secret= auth0 secret key; audience= clientID
var authCheck = jwt({
    secret: new Buffer('-dH4AEwRxWHLM_19c8zGy9oMvLihqESPOvynSeigvsRtd_aHxPayidNE8JJIe3wE', 'base64'),
    audience: 'zZBYySg1ARu4TeWmomEItfM3LJYm9bNZ'
});

//setup end-point
//public end-point
app.get('/api/public', function(req, res) {
    res.json({
        message: "ITFD-516 Rich Internet Application"
    });

});

//private end-point is protected by middleware 'authCheck'
app.get('/api/private', authCheck, function(req, res) {
    res.json({
            message: "Your Fall 2015 PIN: 230192"
    });
});

app.listen(3001);
console.log('Listening on http://localhost:3001');