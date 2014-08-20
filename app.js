var express = require('express'),
    fs = require('fs'),
    expressValidator = require('express-validator'),
    bodyParser = require('body-parser');

var app = express();
app.use(bodyParser());
app.use(expressValidator());
app.disable('x-powered-by');

app.set('bookshelf', require('./modules/bookshelf'));

app.set('port', 3000);

var server = require('http').createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
var io = require('socket.io')(server);

fs.exists(__dirname + '/swagger', function (fs) {
    if (fs) {
        app.use('/swagger', express.static(__dirname + '/swagger'));
    }
});

app.use('/api/v1', require('./routes/api/v1'));

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log('a user connected', socket.id, socket.request.headers);

    socket.on('disconnect', function () {
        console.log('user disconnected', socket.id);
    });

    socket.on('app_started', function () {
        console.log('app started', socket.id);
    });
});

module.exports = app;
