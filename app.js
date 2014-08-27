var express = require('express'),
    fs = require('fs'),
    expressAsyncValidator = require('./modules/express-async-validator/module'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(expressAsyncValidator());
app.disable('x-powered-by');

app.set('bookshelf', require('./modules/bookshelf'));

app.set('port', process.env.PORT || 3000);

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
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(express.static(__dirname + '/public'));

app.use(function (err, req, res, next) {
    res.format({
        'text/plain':       function () {
            res.status(err.status).send(err.message);
        },
        'text/html':        function () {
            res.status(err.status).send(err.message);
        },
        'application/json': function () {
            res.status(err.status).send({
                "error":   err.name,
                "message": err.message
            });
        }
    });
});

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
