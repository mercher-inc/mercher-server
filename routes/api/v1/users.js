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

router.param('userId', function (req, res, next) {
    //nothing to do here if userId is not "me"
    if (req.params.userId !== 'me') {
        next();
        return;
    }

    //user should be authorized to request "me"
    if (!req.get('X-Access-Token')) {
        next(new (require('./errors/not_authorized'))('User is not authorized'));
        return;
    }

    //check access token and set current user's ID
    var AccessToken = require('../../../models/access_token');
    var accessToken = new AccessToken({token: req.get('X-Access-Token')});
    accessToken.fetch({require: true})
        .then(function (accessToken) {
            //everything is ok, setting userId
            req.params.userId = accessToken.get('user_id');
            next();
        })
        .catch(AccessToken.NotFoundError, function () {
            //if we don't recognize this token - user is not authorized
            next(new (require('./errors/not_authorized'))('User is not authorized'));
        });
});

router.param('userId', function (req, res, next) {
    req
        .model({
            "userId": {
                "rules":      {
                    "required":  {
                        "message": "User ID is required"
                    },
                    "isNumeric": {
                        "message": "User ID should be numeric or \"me\""
                    },
                    "toInt":     {}
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
