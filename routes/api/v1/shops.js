var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    Bookshelf = require('../../../modules/bookshelf'),
    ShopsCollection = require('../../../collections/shops'),
    ShopModel = require('../../../models/shop'),
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
    var shopsCollection = new ShopsCollection();
    var shopModel = new ShopModel();

    var collectionRequest = shopsCollection
        .query(function (qb) {
            qb
                .limit(req.query.limit)
                .offset(req.query.offset);
        })
        .fetch({
            withRelated: ['image']
        });

    var totalRequest = Bookshelf
        .knex(shopModel.tableName)
        .count(shopModel.idAttribute)
        .then(function (result) {
            return parseInt(result[0].count);
        });

    Promise
        .props({
            shops: collectionRequest,
            total: totalRequest
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
    Bookshelf
        .transaction(function (t) {
            return new ShopModel()
                .save(req.body, {transacting: t, req: req})
                .then(function (shopModel) {
                    return new ManagerModel()
                        .save({
                            userId: req.currentUser.id,
                            shopId: shopModel.id,
                            role:   'owner'
                        }, {
                            transacting: t
                        })
                        .then(function () {
                            return shopModel;
                        });
                })
                .catch(ShopModel.PermissionError, function (error) {
                    var forbiddenError = new (require('./errors/forbidden'))(error.message);
                    next(forbiddenError);
                })
                .catch(ShopModel.ValidationError, function (error) {
                    var validationError = new (require('./errors/validation'))("Validation failed", error);
                    next(validationError);
                })
                .catch(ShopModel.InternalServerError, function (error) {
                    var internalServerError = new (require('./errors/internal'))(error.message);
                    next(internalServerError);
                })
                .catch(function (error) {
                    var internalServerError = new (require('./errors/internal'))();
                    next(internalServerError);
                });
        })
        .then(function (shopModel) {
            new ShopModel({id: shopModel.id})
                .fetch({
                    withRelated: ['image']
                })
                .then(function (shopModel) {
                    res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/shops/' + shopModel.id);
                    res.status(201).json(shopModel);
                });
        })
        .catch(function (err) {
            var internalServerError = new (require('./errors/internal'))();
            next(internalServerError);
        });
});

router.use('/:shopId', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,PUT'
    });
    next();
});

router.param('shopId', function (req, res, next) {
    req
        .model({
            "shopId": {
                "rules":      {
                    "required":  {
                        "message": "Shop ID is required"
                    },
                    "isNumeric": {
                        "message": "Shop ID should be numeric"
                    },
                    "toInt":     {}
                },
                "source":     ["params"],
                "allowEmpty": false
            }
        })
        .validate()
        .then(function () {
            var shopModel = new ShopModel({id: req.params.shopId});
            shopModel.fetch({require: true})
                .then(function (model) {
                    req.shop = model;
                    next();
                })
                .catch(ShopModel.NotFoundError, function () {
                    var notFoundError = new (require('./errors/not_found'))("Shop was not found");
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

router.get('/:shopId', function (req, res) {
    req.shop
        .load('image')
        .then(function () {
            res.json(req.shop);
        });
});

router.put('/:shopId', require('./middleware/auth_check'));

router.put('/:shopId', function (req, res, next) {
    req.shop
        .save(req.body, {req: req})
        .then(function (shopModel) {
            new ShopModel({id: shopModel.id})
                .fetch({
                    withRelated: ['image']
                })
                .then(function (shopModel) {
                    res.status(200).json(shopModel);
                });
        })
        .catch(ShopModel.PermissionError, function (error) {
            var forbiddenError = new (require('./errors/forbidden'))(error.message);
            next(forbiddenError);
        })
        .catch(ShopModel.ValidationError, function (error) {
            var validationError = new (require('./errors/validation'))("Validation failed", error);
            next(validationError);
        })
        .catch(ShopModel.InternalServerError, function (error) {
            var internalServerError = new (require('./errors/internal'))(error.message);
            next(internalServerError);
        })
        .catch(function (error) {
            var internalServerError = new (require('./errors/internal'))();
            next(internalServerError);
        });
});

router.use('/:shopId/managers', require('./shops/managers'));
router.use('/:shopId/orders', require('./shops/orders'));
router.use('/:shopId/paypal_accounts', require('./shops/paypal_accounts'));

module.exports = router;
