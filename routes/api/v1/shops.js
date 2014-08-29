var express = require('express'),
    router = express.Router(),
    Bookshelf = require('../../../modules/bookshelf'),
    ShopsCollection = require('../../../collections/shops'),
    ShopModel = require('../../../models/shop'),
    expressAsyncValidator = require('../../../modules/express-async-validator/module');

router.use(function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE'
    });
    next();
});

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
            var shopsCollection = new ShopsCollection();
            shopsCollection
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

router.post('/', function (req, res, next) {
    if (!req.currentUser) {
        next(new (require('./errors/unauthorized'))('User is not authorized'));
        return;
    }

    new (expressAsyncValidator.model)({
        "image_id":    {
            "rules":        {
                "isInt": {
                    "message": "Image ID should be integer"
                },
                "toInt": {}
            },
            "allowEmpty":   true,
            "defaultValue": null
        },
        "title":       {
            "rules":      {
                "required": {
                    "message": "Shop's title is required"
                },
                "toString": {},
                "trim":     {},
                "escape":   {},
                "isLength": {
                    "message": "Shop's title should be at least 3 characters long and less then 250 characters",
                    "min":     3,
                    "max":     250
                }
            },
            "allowEmpty": false
        },
        "description": {
            "rules":        {
                "toString": {},
                "escape":   {}
            },
            "allowEmpty":   true,
            "defaultValue": null
        },
        "location":    {
            "rules":        {
                "toString": {},
                "trim":     {},
                "escape":   {},
                "isLength": {
                    "message": "Shop's location should be at least 3 characters long and less then 250 characters",
                    "min":     3,
                    "max":     250
                }
            },
            "allowEmpty":   true,
            "defaultValue": null
        },
        "tax":         {
            "rules":        {
                "isFloat": {
                    "message": "Tax should be float"
                },
                "toFloat": {}
            },
            "allowEmpty":   true,
            "defaultValue": 0
        },
        "is_public":   {
            "rules":        {
                "toBoolean": {}
            },
            "allowEmpty":   true,
            "defaultValue": false
        }
    })
        .validate(req.body)
        .then(function (params) {
            Bookshelf
                .transaction(function (t) {
                    return new ShopModel()
                        .save(params, {transacting: t})
                        .then(function (shopModel) {
                            var ManagerModel = require('../../../models/manager');
                            return new ManagerModel()
                                .save({
                                    user_id: req.currentUser.id,
                                    shop_id: shopModel.id,
                                    role:    'owner'
                                }, {
                                    transacting: t
                                })
                                .then(function () {
                                    return shopModel;
                                });
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
                    res.status(500).json(err);
                });
        })
        .catch(function (error) {
            var badRequestError = new (require('./errors/bad_request'))("Bad request", error);
            next(badRequestError);
        });
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
    res.json(req.shop);
});

module.exports = router;
