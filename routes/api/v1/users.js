var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    Bookshelf = require('../../../modules/bookshelf'),
    UsersCollection = require('../../../collections/users'),
    UserModel = require('../../../models/user'),
    expressAsyncValidator = require('../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET'
    });
    next();
});

router.get('/', require('./middleware/collection_params_check'));

// Fetch users collection
router.get('/', function (req, res, next) {
    var usersCollection = new UsersCollection();
    var userModel = new UserModel();

    var collectionRequest = usersCollection
        .query(function (qb) {
            qb
                .limit(req.query.limit)
                .offset(req.query.offset);
        })
        .fetch({
            withRelated: ['image']
        });

    var totalRequest = Bookshelf
        .knex(userModel.tableName)
        .count(userModel.idAttribute)
        .then(function (result) {
            return parseInt(result[0].count);
        });

    Promise
        .props({
            users: collectionRequest,
            total: totalRequest
        })
        .then(function (results) {
            res.json(results);
        })
        .catch(function (err) {
            next(err);
        });
});

router.use('/:userId', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET'
    });
    next();
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
    req.user
        .load('image')
        .then(function () {
            res.json(req.user);
        });
});

router.put('/:userId', require('./middleware/auth_check'));

router.put('/:userId', function (req, res, next) {
    req.user
        .save(req.body, {req: req})
        .then(function (userModel) {
            new UserModel({id: userModel.id})
                .fetch({
                    withRelated: ['image']
                })
                .then(function (userModel) {
                    res.status(200).json(userModel);
                });
        })
        .catch(UserModel.PermissionError, function (error) {
            var forbiddenError = new (require('./errors/forbidden'))(error.message);
            next(forbiddenError);
        })
        .catch(UserModel.ValidationError, function (error) {
            var validationError = new (require('./errors/validation'))("Validation failed", error);
            next(validationError);
        })
        .catch(UserModel.InternalServerError, function (error) {
            var internalServerError = new (require('./errors/internal'))(error.message);
            next(internalServerError);
        })
        .catch(function (error) {
            var internalServerError = new (require('./errors/internal'))();
            next(internalServerError);
        });
});

router.use('/:userId/managers', require('./users/managers'));

module.exports = router;
