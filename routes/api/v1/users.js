var express = require('express'),
    router = express.Router(),
    UsersCollection = require('../../../collections/users'),
    UserModel = require('../../../models/user'),
    expressAsyncValidator = require('../../../modules/express-async-validator/module');

router.use(function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE'
    });
    next();
});

// Fetch users collection
router.get('/', function (req, res, next) {
    new (expressAsyncValidator.model)({
        "limit":  {
            "rules":        {
                "isInt": {
                    "message": "Limit should be integer"
                },
                "toInt": {}
            },
            "allowEmpty":   true,
            "defaultValue": 10
        },
        "offset": {
            "rules":        {
                "isInt": {
                    "message": "Offset should be integer"
                },
                "toInt": {}
            },
            "allowEmpty":   true,
            "defaultValue": 0
        }
    })
        .validate(req.query)
        .then(function (params) {
            var usersCollection = new UsersCollection();
            usersCollection
                .query(function (qb) {
                    qb.limit(params.limit).offset(params.offset);
                })
                .fetch({
                    withRelated: ['image']
                })
                .then(function (collection) {
                    res.json(collection);
                });
        })
        .catch(function (error) {
            var badRequestError = new (require('./errors/bad_request'))("Bad request", error);
            next(badRequestError);
        });
});

router.param('userId', function (req, res, next) {
    //nothing to do here if userId is not "me"
    if (req.params.userId !== 'me') {
        next();
        return;
    }

    //user should be authorized to request "me"
    if (!req.currentUser) {
        next(new (require('./errors/unauthorized'))('User is not authorized'));
        return;
    }

    //everything is ok, setting userId
    req.params.userId = req.currentUser.get('id');

    next();
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
