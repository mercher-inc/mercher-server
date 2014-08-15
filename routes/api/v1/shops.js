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

router.get('/', function (req, res) {
    var shopsCollection = new ShopsCollection();
    shopsCollection
        .fetch()
        .then(function (collection) {
            res.json(collection);
        });
});

router.param('shopId', function (req, res, next, id) {
    var i;

    req.checkParams('shopId', 'Shop ID should be integer').notEmpty().isInt();
    var errors = req.validationErrors(true);
    if (errors) {
        var requestError = {
            "error":          400,
            "message":        "Bad request",
            "request_errors": []
        };
        for (i in errors) {
            requestError.request_errors.push({
                "field":   errors[i].param,
                "message": errors[i].msg
            });
        }
        res.status(400).json(requestError);
        return;
    }

    var shopModel = new ShopModel({id: id});
    shopModel.fetch({require: true})
        .then(function (model) {
            req.shop = model;
            next();
        })
        .catch(ShopModel.NotFoundError, function () {
            res.status(404).json({
                "error":   404,
                "message": "User was not found"
            });
        })
        .catch(function (err) {
            next(err);
        });
});

router.get('/:shopId', function (req, res) {
    res.json(req.shop);
});

module.exports = router;
