var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    bookshelf = require('../../../../modules/bookshelf'),
    ImageModel = require('../../../../models/image'),
    OrderItemsCollection = require('../../../../collections/order_items'),
    OrderItemModel = require('../../../../models/order_item');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET'
    });
    next();
});

router.get('/', require('../middleware/collection_params_check'));

router.get('/', function (req, res, next) {
    var orderItemsCollection = new OrderItemsCollection();
    var orderItemModel = new OrderItemModel();

    var collectionRequest = orderItemsCollection
        .query(function (qb) {
            qb
                .where('order_id', '=', req.order.id)
                .limit(req.query.limit)
                .offset(req.query.offset);
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
