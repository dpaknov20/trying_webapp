
var express = require('express');
var morgan = require('morgan');
var path = require('path');
//for the body parsing(using JSON method)
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
app.use(morgan('combined'));
//for the JSON file to load 
app.use(bodyParser.json());
var count=0;
app.get('/counter', function (req, res) {
  count=count+1;    
  res.send(count.toString());
});
var point =0;
app.post('/robot_present_values', function (req, res) {
    point=req.body.point;  
});
app.get('/robot_values', function (req, res) {
  res.send(point.toString());
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

var port = 80;
app.listen(port, function () {
  console.log(`Dpaknov20 app listening on port ${port}!`);
});
