(function (module, require) {

    var express = require('express'),
        http = require('http'),
        expressAsyncValidator = require('./modules/express-async-validator/module'),
        bodyParser = require('body-parser'),
        cookieParser = require('cookie-parser'),
        favicon = require('serve-favicon'),
        app = module.exports = express(),
        queue = module.exports.queue = require('./modules/queue'),
        server = http.createServer(app),
        io = module.exports.io = require('socket.io')(server),
        bookshelf = module.exports.bookshelf = require('./modules/bookshelf');

    app.set('queue', queue);
    app.set('io', io);
    app.set('bookshelf', bookshelf);

    app.set('port', process.env.PORT || 3000);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(cookieParser());
    app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(expressAsyncValidator());
    app.disable('x-powered-by');

    app.use('/swagger', express.static(__dirname + '/swagger'));
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
        console.log('a user connected', socket.id/*, socket.request.headers*/);

        socket.on('disconnect', function () {
            console.log('user disconnected', socket.id);
        });
    });

    bookshelf.knex.migrate.latest()
        .then(function () {
            server.listen(app.get('port'), function () {
                console.log("Express server listening on port " + app.get('port'));
            });
        });

})(module, require);
