var express = require('express');
var router = express.Router();
var ShopsCollection = require('../../../collections/shops');
var ShopModel = require('../../../models/shop');

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
    var shopModel = new ShopModel({id: id});
    shopModel.fetch({require: true})
        .then(function (model) {
            req.shop = model;
            next();
        })
        .catch(ShopModel.NotFoundError, function () {
            res.status(404).json(null);
        })
        .catch(function (err) {
            next(err);
        });
});

router.get('/:shopId', function (req, res) {
    res.json(req.shop);
});

module.exports = router;
