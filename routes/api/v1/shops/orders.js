var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    Bookshelf = require('../../../../modules/bookshelf'),
    ImageModel = require('../../../../models/image'),
    OrdersCollection = require('../../../../collections/orders'),
    OrderModel = require('../../../../models/order');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST'
    });
    next();
});

router.post('/', require('../middleware/auth_check'));
router.get('/', require('../middleware/collection_params_check'));

router.get('/', function (req, res, next) {
    var ordersCollection = new OrdersCollection();
    var orderModel = new OrderModel();

    var collectionRequest = ordersCollection
        .query(function (qb) {
            qb
                .where('shop_id', '=', req.shop.id)
                .limit(req.query.limit)
                .offset(req.query.offset);
        })
        .fetch({
            withRelated: ['user.image', 'orderItems.product']
        });

    var totalRequest = Bookshelf
        .knex(orderModel.tableName)
        .where('shop_id', '=', req.shop.id)
        .count(orderModel.idAttribute)
        .then(function (result) {
            return parseInt(result[0].count);
        });

    Promise
        .props({
            orders: collectionRequest,
            total:  totalRequest
        })
        .then(function (results) {
            res.json(results);
        })
        .catch(function (err) {
            next(err);
        });
});

module.exports = router;
