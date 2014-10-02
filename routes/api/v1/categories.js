var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    bookshelf = require('../../../modules/bookshelf'),
    CategoriesCollection = require('../../../collections/categories'),
    CategoryModel = require('../../../models/category'),
    validator = require('../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST'
    });
    next();
});

router.get('/', validator(require('./validation/collection.json'), {source: 'query', param: 'collectionForm'}));

router.get('/', function (req, res, next) {
    var categoriesCollection = new CategoriesCollection();
    var categoryModel = new CategoryModel();

    var collectionRequest = categoriesCollection
        .query(function (qb) {
            qb
                .limit(req['collectionForm'].limit)
                .offset(req['collectionForm'].offset);
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

router.post('/', validator(require('./validation/categories/create.json'), {source: 'body', param: 'createForm'}));

router.post('/', function (req, res, next) {
    new CategoryModel()
        .save(req['createForm'])
        .then(function (categoryModel) {
            return categoryModel.load(['image']);
        })
        .then(function (categoryModel) {
            res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/categories/' + categoryModel.id);
            res.status(201).json(categoryModel);
        });
});

router.use('/:categoryId', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,PUT,DELETE'
    });
    next();
});

router.param('categoryId', function (req, res, next) {
    var categoryModel = new CategoryModel({id: parseInt(req.params.categoryId)});
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
});

router.get('/:categoryId', function (req, res) {
    req.category
        .load('image')
        .then(function () {
            res.json(req.category);
        });
});

router.put('/:categoryId', require('./middleware/auth_check'));

router.put('/:categoryId', validator(require('./validation/categories/update.json'), {source: 'body', param: 'updateForm'}));

router.put('/:categoryId', function (req, res, next) {
    req.category
        .save(req['updateForm'])
        .then(function (categoryModel) {
            return categoryModel.load(['image']);
        })
        .then(function (categoryModel) {
            res.status(200).json(categoryModel);
        });
});

router.use('/:categoryId/products', require('./categories/products'));

module.exports = router;
