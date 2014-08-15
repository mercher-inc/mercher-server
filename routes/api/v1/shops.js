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
        .fetch()
        .then(function (collection) {
            res.json(collection);
        });
});

router.param('shopId', function (req, res, next, id) {

    req.checkParams('shopId', 'Shop ID is required').notEmpty();
    req.checkParams('shopId', 'Shop ID should be integer').isInt();

    var errors = req.validationErrors();
    if (errors) {
        var badRequestError = new (require('./errors/bad_request'))("Bad request", errors);
        next(badRequestError);
        return;
    }

    var shopModel = new ShopModel({id: id});
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
});

router.get('/:shopId', function (req, res) {
    res.json(req.shop);
});

module.exports = router;
