var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    bookshelf = require('../../../modules/bookshelf'),
    ManagersCollection = require('../../../collections/managers'),
    ManagerModel = require('../../../models/manager'),
    expressAsyncValidator = require('../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST'
    });
    next();
});

router.get('/', require('./middleware/collection_params_check'));

router.get('/', function (req, res, next) {
    var managersCollection = new ManagersCollection();
    var managerModel = new ManagerModel();

    var collectionRequest = managersCollection
        .query(function (qb) {
            qb
                .limit(req.query.limit)
                .offset(req.query.offset);
        })
        .fetch({
            withRelated: ['shop.image', 'user.image']
        });

    var totalRequest = bookshelf
        .knex(managerModel.tableName)
        .count(managerModel.idAttribute)
        .then(function (result) {
            return parseInt(result[0].count);
        });

    Promise
        .props({
            managers: collectionRequest,
            total:    totalRequest
        })
        .then(function (results) {
            res.json(results);
        })
        .catch(function (err) {
            next(err);
        });
});

router.post('/', require('./middleware/auth_check'));

router.post('/', function (req, res, next) {
    new ManagerModel()
        .save(req.body, {req: req})
        .then(function (managerModel) {
            new ManagerModel({id: managerModel.id})
                .fetch({
                    withRelated: ['shop.image', 'user.image']
                })
                .then(function (managerModel) {
                    res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/managers/' + managerModel.id);
                    res.status(201).json(managerModel);
                });
        })
        .catch(ManagerModel.PermissionError, function (error) {
            var forbiddenError = new (require('./errors/forbidden'))(error.message);
            next(forbiddenError);
        })
        .catch(ManagerModel.ValidationError, function (error) {
            var validationError = new (require('./errors/validation'))("Validation failed", error);
            next(validationError);
        })
        .catch(ManagerModel.InternalServerError, function (error) {
            var internalServerError = new (require('./errors/internal'))(error.message);
            next(internalServerError);
        })
        .catch(function (error) {
            console.log(error);
            var internalServerError = new (require('./errors/internal'))();
            next(internalServerError);
        });
});

router.use('/:managerId', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,PUT,DELETE'
    });
    next();
});

router.param('managerId', function (req, res, next) {
    req
        .model({
            "managerId": {
                "rules":      {
                    "required":  {
                        "message": "Manager ID is required"
                    },
                    "isNumeric": {
                        "message": "Manager ID should be numeric"
                    },
                    "toInt":     {}
                },
                "source":     ["params"],
                "allowEmpty": false
            }
        })
        .validate()
        .then(function () {
            var managerModel = new ManagerModel({id: req.params.managerId});
            managerModel.fetch({require: true})
                .then(function (model) {
                    req.manager = model;
                    next();
                })
                .catch(ManagerModel.NotFoundError, function () {
                    var notFoundError = new (require('./errors/not_found'))("Manager was not found");
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

router.get('/:managerId', function (req, res) {
    req.manager
        .load(['shop.image', 'user.image'])
        .then(function () {
            res.json(req.manager);
        });
});

router.put('/:managerId', require('./middleware/auth_check'));

router.put('/:managerId', function (req, res, next) {
    req.manager
        .save(req.body, {req: req})
        .then(function (managerModel) {
            new ManagerModel({id: managerModel.id})
                .fetch({
                    withRelated: ['shop.image', 'user.image']
                })
                .then(function (managerModel) {
                    res.status(200).json(managerModel);
                });
        })
        .catch(ManagerModel.PermissionError, function (error) {
            var forbiddenError = new (require('./errors/forbidden'))(error.message);
            next(forbiddenError);
        })
        .catch(ManagerModel.ValidationError, function (error) {
            var validationError = new (require('./errors/validation'))("Validation failed", error);
            next(validationError);
        })
        .catch(ManagerModel.InternalServerError, function (error) {
            var internalServerError = new (require('./errors/internal'))(error.message);
            next(internalServerError);
        })
        .catch(function (error) {
            var internalServerError = new (require('./errors/internal'))();
            next(internalServerError);
        });
});

module.exports = router;