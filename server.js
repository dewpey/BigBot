// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var http       = require ('https');
var querystring = require('querystring');
var request    = require('request');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : 'blurjoe',
  password : '',
  database : 'c9'
});
 
connection.connect();

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/getClosest', function(req, res) {
// Set the headers
var headers = {
    'Content-Type': 'application/x-www-form-urlencoded'

}
var zipcode = req.query.zip
console.log(zipcode)
// Configure the request
var options = {
    url: 'https://aim.bbbs.org/einquiry/einquiryzip.aspx?t=2',
    method: 'POST',
    headers: headers,
    form: {'zipCode': zipcode}
}

// Start the request
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        var output = body.toString('utf8')
        //console.log(output)
        var index = output.indexOf('<span id="labAgy"><b>') + 21
        output = output.substring(index)
        var index1 = output.indexOf('</b>')
        var name = output.substring(0,index1) + " has been set as your local Big Brother Big Sister Chapter"
        res.send({
 "messages": [
   {"text": name }
 ]
});
    }
})
  
 
});



// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

