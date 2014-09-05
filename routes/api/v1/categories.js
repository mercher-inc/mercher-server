var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    bookshelf = require('../../../modules/bookshelf'),
    CategoriesCollection = require('../../../collections/categories'),
    CategoryModel = require('../../../models/category'),
    expressAsyncValidator = require('../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST'
    });
    next();
});

router.get('/', require('./middleware/collection_params_check'));

router.get('/', function (req, res, next) {
    var categoriesCollection = new CategoriesCollection();
    var categoryModel = new CategoryModel();

    var collectionRequest = categoriesCollection
        .query(function (qb) {
            qb
                .limit(req.query.limit)
                .offset(req.query.offset);
        })
        .fetch({
            withRelated: ['image']
        });

    var totalRequest = bookshelf
        .knex(categoryModel.tableName)
        .count(categoryModel.idAttribute)
        .then(function (result) {
            return parseInt(result[0].count);
        });

    Promise
        .props({
            categories: collectionRequest,
            total:      totalRequest
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
    new CategoryModel()
        .save(req.body, {req: req})
        .then(function (categoryModel) {
            new CategoryModel({id: categoryModel.id})
                .fetch({
                    withRelated: ['image']
                })
                .then(function (categoryModel) {
                    res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/categories/' + categoryModel.id);
                    res.status(201).json(categoryModel);
                });
        })
        .catch(CategoryModel.PermissionError, function (error) {
            var forbiddenError = new (require('./errors/forbidden'))(error.message);
            next(forbiddenError);
        })
        .catch(CategoryModel.ValidationError, function (error) {
            var validationError = new (require('./errors/validation'))("Validation failed", error);
            next(validationError);
        })
        .catch(CategoryModel.InternalServerError, function (error) {
            var internalServerError = new (require('./errors/internal'))(error.message);
            next(internalServerError);
        })
        .catch(function (error) {
            console.log(error);
            var internalServerError = new (require('./errors/internal'))(error);
            next(internalServerError);
        });
});

router.use('/:categoryId', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,PUT,DELETE'
    });
    next();
});

router.param('categoryId', function (req, res, next) {
    req
        .model({
            "categoryId": {
                "rules":      {
                    "required":  {
                        "message": "Category ID is required"
                    },
                    "isNumeric": {
                        "message": "Category ID should be numeric"
                    },
                    "toInt":     {}
                },
                "source":     ["params"],
                "allowEmpty": false
            }
        })
        .validate()
        .then(function () {
            var categoryModel = new CategoryModel({id: req.params.categoryId});
            categoryModel.fetch({require: true})
                .then(function (model) {
                    req.category = model;
                    next();
                })
                .catch(CategoryModel.NotFoundError, function () {
                    var notFoundError = new (require('./errors/not_found'))("Category was not found");
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

router.get('/:categoryId', function (req, res) {
    req.category
        .load('image')
        .then(function () {
            res.json(req.category);
        });
});

router.put('/:categoryId', require('./middleware/auth_check'));

router.put('/:categoryId', function (req, res, next) {
    req.category
        .save(req.body, {req: req})
        .then(function (categoryModel) {
            new CategoryModel({id: categoryModel.id})
                .fetch({
                    withRelated: ['image']
                })
                .then(function (categoryModel) {
                    res.status(200).json(categoryModel);
                });
        })
        .catch(CategoryModel.PermissionError, function (error) {
            var forbiddenError = new (require('./errors/forbidden'))(error.message);
            next(forbiddenError);
        })
        .catch(CategoryModel.ValidationError, function (error) {
            var validationError = new (require('./errors/validation'))("Validation failed", error);
            next(validationError);
        })
        .catch(CategoryModel.InternalServerError, function (error) {
            var internalServerError = new (require('./errors/internal'))(error.message);
            next(internalServerError);
        })
        .catch(function (error) {
            var internalServerError = new (require('./errors/internal'))();
            next(internalServerError);
        });
});

module.exports = router;
