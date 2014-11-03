var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    bookshelf = require('../../../../modules/bookshelf'),
    ShopReviewsCollection = require('../../../../collections/shop_reviews'),
    ShopReviewModel = require('../../../../models/shop_review'),
    validator = require('../../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET'
    });
    next();
});

router.get('/', validator(require('../validation/collection.json'), {source: 'query', param: 'collectionForm'}));

router.get('/', function (req, res, next) {
    var shopReviewsCollection = new ShopReviewsCollection();
    var shopReviewModel = new ShopReviewModel();

    var collectionRequest = shopReviewsCollection
        .query(function (qb) {
            qb
                .where('user_id', '=', req.user.id)
                .limit(req['collectionForm'].limit)
                .offset(req['collectionForm'].offset);
        })
        .fetch({
            withRelated: ['shop.image']
        });

    var totalRequest = bookshelf
        .knex(shopReviewModel.tableName)
        .where('user_id', '=', req.user.id)
        .count(shopReviewModel.idAttribute)
        .then(function (result) {
            return parseInt(result[0].count);
        });

    Promise
        .props({
            shopReviews: collectionRequest,
            total:       totalRequest
        })
        .then(function (results) {
            res.json(results);
        })
        .catch(function (err) {
            next(err);
        });
});

module.exports = router;
