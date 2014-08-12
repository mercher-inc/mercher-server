var express = require('express');

var app = express();

app.set('port', 3000);

var server = require('http').createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

app.use(express.static(__dirname + '/public'));

module.exports = app;