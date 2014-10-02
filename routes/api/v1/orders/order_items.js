var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    bookshelf = require('../../../../modules/bookshelf'),
    ImageModel = require('../../../../models/image'),
    OrderItemsCollection = require('../../../../collections/order_items'),
    OrderItemModel = require('../../../../models/order_item'),
    validator = require('../../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET'
    });
    next();
});

router.get('/', validator(require('../validation/collection.json'), {source: 'query', param: 'collectionForm'}));

router.get('/', function (req, res, next) {
    var orderItemsCollection = new OrderItemsCollection();
    var orderItemModel = new OrderItemModel();

    var collectionRequest = orderItemsCollection
        .query(function (qb) {
            qb
                .where('order_id', '=', req.order.id)
                .limit(req['collectionForm'].limit)
                .offset(req['collectionForm'].offset);
        })
        .fetch({
            withRelated: ['product']
        });

    var totalRequest = bookshelf
        .knex(orderItemModel.tableName)
        .where('order_id', '=', req.order.id)
        .count(orderItemModel.idAttribute)
        .then(function (result) {
            return parseInt(result[0].count);
        });

    Promise
        .props({
            orderItems: collectionRequest,
            total:      totalRequest
        })
        .then(function (results) {
            res.json(results);
        })
        .catch(function (err) {
            next(err);
        });
});

module.exports = router;
