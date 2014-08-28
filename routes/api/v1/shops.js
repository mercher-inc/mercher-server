var express = require('express'),
    router = express.Router(),
    ShopsCollection = require('../../../collections/shops'),
    ShopModel = require('../../../models/shop');

router.use(function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE'
    });
    next();
});

router.get('/', function (req, res, next) {
    var shopsCollection = new ShopsCollection();
    shopsCollection
        .fetch({
            withRelated: ['image']
        })
        .then(function (collection) {
            res.json(collection);
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
