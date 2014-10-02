var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    Bookshelf = require('../../../../modules/bookshelf'),
    ImageModel = require('../../../../models/image'),
    OrdersCollection = require('../../../../collections/orders'),
    OrderModel = require('../../../../models/order'),
    validator = require('../../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST'
    });
    next();
});

router.get('/', require('../middleware/auth_check'));

router.get('/', validator(require('../validation/collection.json'), {source: 'query', param: 'collectionForm'}));

router.get('/', function (req, res, next) {
    var ordersCollection = new OrdersCollection();
    var orderModel = new OrderModel();

    var collectionRequest = ordersCollection
        .query(function (qb) {
            qb
                .where('user_id', '=', req.user.id)
                .limit(req['collectionForm'].limit)
                .offset(req['collectionForm'].offset);
        })
        .fetch({
            withRelated: ['total', 'shop.image', 'orderItems.product']
        });

    var totalRequest = Bookshelf
        .knex(orderModel.tableName)
        .where('user_id', '=', req.user.id)
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
