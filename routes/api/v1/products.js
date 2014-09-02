var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    ProductsCollection = require('../../../collections/products'),
    ProductModel = require('../../../models/product'),
    expressAsyncValidator = require('../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST'
    });
    next();
});

router.get('/', require('./middleware/collection_params_check'));

router.get('/', function (req, res, next) {
    var productsCollection = new ProductsCollection();
    var productModel = new ProductModel();
    Promise
        .props({
            products: productsCollection
                .query(function (qb) {
                    qb.limit(req.query.limit).offset(req.query.offset);
                })
                .fetch({
                    withRelated: ['shop.image']
                }),
            total:    productModel
                .query()
                .count(productModel.idAttribute)
                .then(function (result) {
                    return parseInt(result[0].count);
                })
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
    new ProductModel()
        .save(req.body, {req: req})
        .then(function (productModel) {
            new ProductModel({id: productModel.id})
                .fetch({
                    withRelated: ['shop.image']
                })
                .then(function (productModel) {
                    res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/products/' + productModel.id);
                    res.status(201).json(productModel);
                });
        })
        .catch(ProductModel.PermissionError, function (error) {
            var forbiddenError = new (require('./errors/forbidden'))(error.message);
            next(forbiddenError);
        })
        .catch(ProductModel.ValidationError, function (error) {
            var validationError = new (require('./errors/validation'))("Validation failed", error);
            next(validationError);
        })
        .catch(ProductModel.InternalServerError, function (error) {
            var internalServerError = new (require('./errors/internal'))(error.message);
            next(internalServerError);
        })
        .catch(function (error) {
            var internalServerError = new (require('./errors/internal'))();
            next(internalServerError);
        });
});

router.use('/:productId', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,PUT,DELETE'
    });
    next();
});

router.param('productId', function (req, res, next) {
    req
        .model({
            "productId": {
                "rules":      {
                    "required":  {
                        "message": "Product ID is required"
                    },
                    "isNumeric": {
                        "message": "Product ID should be numeric"
                    },
                    "toInt":     {}
                },
                "source":     ["params"],
                "allowEmpty": false
            }
        })
        .validate()
        .then(function () {
            var productModel = new ProductModel({id: req.params.productId});
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
        })
        .catch(function (error) {
            var badRequestError = new (require('./errors/bad_request'))("Bad request", error);
            next(badRequestError);
        });
});

router.get('/:productId', function (req, res) {
    req.product
        .load('shop.image')
        .then(function () {
            res.json(req.product);
        });
});

router.put('/:productId', require('./middleware/auth_check'));

router.put('/:productId', function (req, res, next) {
    req.product
        .save(req.body, {req: req})
        .then(function (productModel) {
            new ProductModel({id: productModel.id})
                .fetch({
                    withRelated: ['shop.image']
                })
                .then(function (productModel) {
                    res.status(200).json(productModel);
                });
        })
        .catch(ProductModel.PermissionError, function (error) {
            var forbiddenError = new (require('./errors/forbidden'))(error.message);
            next(forbiddenError);
        })
        .catch(ProductModel.ValidationError, function (error) {
            var validationError = new (require('./errors/validation'))("Validation failed", error);
            next(validationError);
        })
        .catch(ProductModel.InternalServerError, function (error) {
            var internalServerError = new (require('./errors/internal'))(error.message);
            next(internalServerError);
        })
        .catch(function (error) {
            var internalServerError = new (require('./errors/internal'))();
            next(internalServerError);
        });
});

router.use('/:productId/images', require('./products/images'));
module.exports = router;
