var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    Bookshelf = require('../../../modules/bookshelf'),
    ProductsCollection = require('../../../collections/products'),
    ProductModel = require('../../../models/product'),
    ManagerModel = require('../../../models/manager'),
    expressAsyncValidator = require('../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST'
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
            var productsCollection = new ProductsCollection();
            var productModel = new ProductModel();
            Promise
                .props({
                    products: productsCollection
                        .query(function (qb) {
                            qb.limit(params.limit).offset(params.offset);
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
        "shop_id":         {
            "rules":      {
                "required": {
                    "message": "Shop ID is required"
                },
                "isInt":    {
                    "message": "Shop ID should be integer"
                },
                "toInt":    {}
            },
            "allowEmpty": false
        },
        "category_id":     {
            "rules":        {
                "isInt": {
                    "message": "Category ID should be integer"
                },
                "toInt": {}
            },
            "allowEmpty":   true,
            "defaultValue": null
        },
        "title":           {
            "rules":      {
                "required": {
                    "message": "Product's title is required"
                },
                "toString": {},
                "trim":     {},
                "escape":   {},
                "isLength": {
                    "message": "Product's title should be at least 3 characters long and less then 250 characters",
                    "min":     3,
                    "max":     250
                }
            },
            "allowEmpty": false
        },
        "description":     {
            "rules":        {
                "toString": {},
                "escape":   {}
            },
            "allowEmpty":   true,
            "defaultValue": null
        },
        "price":           {
            "rules":        {
                "isFloat": {
                    "message": "Price should be float"
                },
                "toFloat": {}
            },
            "allowEmpty":   true,
            "defaultValue": null
        },
        "shipping_cost":   {
            "rules":        {
                "isFloat": {
                    "message": "Shipping cost should be float"
                },
                "toFloat": {}
            },
            "allowEmpty":   true,
            "defaultValue": null
        },
        "shipping_weight": {
            "rules":        {
                "isFloat": {
                    "message": "Shipping weight should be float"
                },
                "toFloat": {}
            },
            "allowEmpty":   true,
            "defaultValue": null
        },
        "amount_in_stock": {
            "rules":        {
                "isInt": {
                    "message": "Amount in stock should be integer"
                },
                "toInt": {}
            },
            "allowEmpty":   true,
            "defaultValue": null
        },
        "is_unique":       {
            "rules":        {
                "toBoolean": {}
            },
            "allowEmpty":   true,
            "defaultValue": false
        },
        "is_public":       {
            "rules":        {
                "toBoolean": {}
            },
            "allowEmpty":   true,
            "defaultValue": false
        }
    })
        .validate(req.body)
        .then(function (params) {
            new ProductModel()
                .save(params)
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
                .catch(function (err) {
                    res.status(500).json(err);
                });
        })
        .catch(function (error) {
            var validationError = new (require('./errors/validation'))("Validation failed", error);
            next(validationError);
        });


});

module.exports = router;