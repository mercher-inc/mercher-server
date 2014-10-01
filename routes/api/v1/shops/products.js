var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    Bookshelf = require('../../../../modules/bookshelf'),
    ProductsCollection = require('../../../../collections/products'),
    ProductModel = require('../../../../models/product'),
    validator = require('../../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET'
    });
    next();
});

router.get('/', validator(require('../validation/collection.json'), {source: 'query', param: 'collectionForm'}));

router.get('/', function (req, res, next) {
    var productsCollection = new ProductsCollection();
    var productModel = new ProductModel();

    var collectionRequest = productsCollection
        .query(function (qb) {
            qb
                .where('shop_id', '=', req.shop.id)
                .limit(req['collectionForm'].limit)
                .offset(req['collectionForm'].offset);
        })
        .fetch({
            withRelated: ['shop.image']
        });

    var totalRequest = Bookshelf
        .knex(productModel.tableName)
        .where('shop_id', '=', req.shop.id)
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

module.exports = router;
