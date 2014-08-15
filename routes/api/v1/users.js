var express = require('express'),
    router = express.Router(),
    UsersCollection = require('../../../collections/users'),
    UserModel = require('../../../models/user');

router.use(function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE'
    });
    next();
});

router.get('/', function (req, res, next) {
    var usersCollection = new UsersCollection();
    usersCollection
        .fetch()
        .then(function (collection) {
            res.json(collection);
        });
});

router.param('userId', function (req, res, next, id) {

    req.checkParams('userId', 'User ID is required').notEmpty();
    req.checkParams('userId', 'User ID should be integer').isInt();

    var errors = req.validationErrors();
    if (errors) {
        var badRequestError = new (require('./errors/bad_request'))("Bad request", errors);
        next(badRequestError);
        return;
    }

    if (id === 'me') {
        id = 1; // TODO: get current user id from session
    }

    var userModel = new UserModel({id: id});
    userModel.fetch({require: true})
        .then(function (model) {
            req.user = model;
            next();
        })
        .catch(UserModel.NotFoundError, function () {
            var notFoundError = new (require('./errors/not_found'))("User was not found");
            next(notFoundError);
        })
        .catch(function (err) {
            next(err);
        });
});

router.get('/:userId', function (req, res) {
    res.json(req.user);
});

module.exports = router;
