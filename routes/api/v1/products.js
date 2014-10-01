var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    Bookshelf = require('../../../modules/bookshelf'),
    ProductsCollection = require('../../../collections/products'),
    ProductModel = require('../../../models/product'),
    validator = require('../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST'
    });
    next();
});

router.get('/', validator(require('./validation/collection.json'), {source: 'query', param: 'collectionForm'}));

router.get('/', function (req, res, next) {
    var productsCollection = new ProductsCollection();
    var productModel = new ProductModel();

    var collectionRequest = productsCollection
        .query(function (qb) {
            qb
                .limit(req['collectionForm'].limit)
                .offset(req['collectionForm'].offset);
        })
        .fetch({
            withRelated: ['shop.image']
        });

    var totalRequest = Bookshelf
        .knex(productModel.tableName)
        .count(productModel.idAttribute)
        .then(function (result) {
            return parseInt(result[0].count);
        });

    Promise
        .props({
            products: collectionRequest,
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

router.post('/', validator(require('./validation/products/create.json'), {source: 'body', param: 'createForm'}));

router.post('/', function (req, res, next) {
    new ProductModel()
        .save(req['createForm'])
        .then(function (productModel) {
            return productModel.load(['shop.image']);
        })
        .then(function (productModel) {
            res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/products/' + productModel.id);
            res.status(201).json(productModel);
        });
});

router.use('/:productId', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,PUT'
    });
    next();
});

router.param('productId', function (req, res, next) {
    var productModel = new ProductModel({id: parseInt(req.params.productId)});
    productModel.fetch({require: true})
        .then(function (model) {
            req.product = model;
            next();
        })
        .catch(ProductModel.NotFoundError, function () {
            var notFoundError = new (require('./errors/not_found'))("Product was not found");
            next(notFoundError);
        })
        .catch(function (err) {
            next(err);
        });
});

router.get('/:productId', function (req, res) {
    req.product
        .load(['shop.image'])
        .then(function () {
            res.json(req.product);
        });
});

router.put('/:productId', require('./middleware/auth_check'));

router.put('/:productId', validator(require('./validation/products/update.json'), {source: 'body', param: 'updateForm'}));

router.put('/:productId', function (req, res, next) {
    req.product
        .save(req['updateForm'])
        .then(function (productModel) {
            return productModel.load(['shop.image']);
        })
        .then(function (productModel) {
            res.status(200).json(productModel);
        });
});

router.use('/:productId/product_images', require('./products/product_images'));

module.exports = router;
