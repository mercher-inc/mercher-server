var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    bookshelf = require('../../../../modules/bookshelf'),
    ProductReviewsCollection = require('../../../../collections/product_reviews'),
    ProductReviewModel = require('../../../../models/product_review'),
    validator = require('../../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET'
    });
    next();
});

router.get('/', validator(require('../validation/collection.json'), {source: 'query', param: 'collectionForm'}));

router.get('/', function (req, res, next) {
    var productReviewsCollection = new ProductReviewsCollection();
    var productReviewModel = new ProductReviewModel();

    var collectionRequest = productReviewsCollection
        .query(function (qb) {
            qb
                .where('product_id', '=', req.product.id)
                .limit(req['collectionForm'].limit)
                .offset(req['collectionForm'].offset);
        })
        .fetch({
            withRelated: ['user.image']
        });

    var totalRequest = bookshelf
        .knex(productReviewModel.tableName)
        .where('product_id', '=', req.product.id)
        .count(productReviewModel.idAttribute)
        .then(function (result) {
            return parseInt(result[0].count);
        });

    Promise
        .props({
            productReviews: collectionRequest,
            total:          totalRequest
        })
        .then(function (results) {
            res.json(results);
        })
        .catch(function (err) {
            next(err);
        });
});

module.exports = router;
