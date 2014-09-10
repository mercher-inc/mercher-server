var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    Bookshelf = require('../../../../modules/bookshelf'),
    ProductsCollection = require('../../../../collections/products'),
    ProductModel = require('../../../../models/product');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET'
    });
    next();
});

router.get('/', require('../middleware/collection_params_check'));

router.get('/', function (req, res, next) {
    var productsCollection = new ProductsCollection();
    var productModel = new ProductModel();

    var collectionRequest = productsCollection
        .query(function (qb) {
            qb
                .where('category_id', '=', req.category.id)
                .limit(req.query.limit)
                .offset(req.query.offset);
        })
        .fetch({
            withRelated: ['shop.image']
        });

    var totalRequest = Bookshelf
        .knex(productModel.tableName)
        .where('category_id', '=', req.category.id)
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
