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
    req
        .model({
            "userId": {
                "rules":      {
                    "required": {
                        "message": "User ID is required"
                    },
                    "matches":  {
                        "message":   "User ID should be numeric or \"me\"",
                        "pattern":   /^([0-9]+|me)$/,
                        "modifiers": ""
                    }
                },
                "source":     ["params"],
                "allowEmpty": false
            }
        })
        .validate()
        .then(function () {
            var userModel = new UserModel({id: req.params.userId});
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
        })
        .catch(function (error) {
            var badRequestError = new (require('./errors/bad_request'))("Bad request", error);
            next(badRequestError);
        });
});

router.get('/:userId', function (req, res) {
    res.json(req.user);
});

module.exports = router;
