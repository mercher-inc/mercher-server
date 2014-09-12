(function (module, require) {

    var express = require('express'),
        http = require('http'),
        expressAsyncValidator = require('./modules/express-async-validator/module'),
        bodyParser = require('body-parser'),
        cookieParser = require('cookie-parser'),
        favicon = require('serve-favicon'),
        serveStatic = require('serve-static'),
        useragent = require('express-useragent'),
        app = module.exports = express(),
        queue = module.exports.queue = require('./modules/queue'),
        server = http.createServer(app),
        io = module.exports.io = require('socket.io')(server),
        bookshelf = module.exports.bookshelf = require('./modules/bookshelf');

    app.set('queue', queue);
    app.set('io', io);
    app.set('bookshelf', bookshelf);
    app.set('views', './views');
    app.set('view engine', 'jade');

    app.set('port', process.env.PORT || 3000);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(useragent.express());
    app.use(cookieParser());
    app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(expressAsyncValidator());
    app.disable('x-powered-by');

    app.use('/swagger', serveStatic(__dirname + '/swagger'));
    app.use('/api/v1', require('./routes/api/v1'));

    app.use('/uploads', serveStatic(__dirname + '/uploads'));
    app.use('/fonts', serveStatic(__dirname + '/public/fonts'));
    app.use('/images', serveStatic(__dirname + '/public/images'));
    app.use('/scripts', serveStatic(__dirname + '/public/scripts'));
    app.use('/styles', serveStatic(__dirname + '/public/styles'));
    app.use('/views', serveStatic(__dirname + '/public/views'));

    app.use(function (req, res, next) {
        if (req.useragent.isBot) {
            require('./routes/index')(req, res, next);
        } else {
            next();
        }
    });

    app.use(function (req, res, next) {
        if (req.url !== '/' && req.useragent.isIE) {
            res.redirect('/#!' + req.url);
        } else {
            next();
        }
    });

    app.use(function (req, res, next) {
        res.sendFile(__dirname + '/public/index.html');
    });

    app.use(function (err, req, res, next) {
        console.log(err);
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
