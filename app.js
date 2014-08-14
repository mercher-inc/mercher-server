var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.set('APP_ROOT', __dirname);
app.use(bodyParser());

app.set('bookshelf', require('./modules/bookshelf'));

app.set('port', 3000);

var server = require('http').createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
var io = require('socket.io')(server);

app.use('/api/v1', require('./routes/api/v1'));

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log('a user connected', socket.id/*, socket.request.headers*/);
    socket.on('disconnect', function () {
        console.log('user disconnected', socket.id);
    });

    socket.on('app_started', function (socket) {
        console.log('app started', socket.id);
    });
});

module.exports = app;