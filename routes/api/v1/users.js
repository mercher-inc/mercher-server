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

router.get('/', function (req, res) {
    var usersCollection = new UsersCollection();
    usersCollection
        .fetch()
        .then(function (collection) {
            res.json(collection);
        });
});

router.param('userId', function (req, res, next, id) {
    var i;

    req.checkParams('userId', 'User ID should be integer').notEmpty().isInt();
    var errors = req.validationErrors(true);
    if (errors) {
        var requestError = {
            "error":          400,
            "message":        "Bad request",
            "request_errors": []
        };
        for (i in errors) {
            requestError.request_errors.push({
                "field":   errors[i].param,
                "message": errors[i].msg
            });
        }
        res.status(400).json(requestError);
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
            res.status(404).json({
                "error":   404,
                "message": "User was not found"
            });
        })
        .catch(function (err) {
            next(err);
        });
});

router.get('/:userId', function (req, res) {
    res.json(req.user);
});

module.exports = router;
