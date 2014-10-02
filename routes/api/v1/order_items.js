var express = require('express'),
    router = express.Router(),
    OrderItemModel = require('../../../models/order_item'),
    validator = require('../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });
    next();
});

router.post('/', require('./middleware/auth_check'));

router.post('/', validator(require('./validation/order_items/create.json'), {source: 'body', param: 'createForm'}));

router.post('/', function (req, res, next) {
    new OrderItemModel()
        .save(req['createForm'])
        .then(function (orderItemModel) {
            return orderItemModel.load(['product']);
        })
        .then(function (orderItemModel) {
            res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/order_items/' + orderItemModel.id);
            res.status(201).json(orderItemModel);
        });
});

router.use('/:orderItemId', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,PUT,DELETE'
    });
    next();
});

router.param('orderItemId', function (req, res, next) {
    var orderItemModel = new OrderItemModel({id: parseInt(req.params.orderItemId)});
    orderItemModel.fetch({require: true})
        .then(function (model) {
            req.orderItem = model;
            next();
        })
        .catch(OrderItemModel.NotFoundError, function () {
            var notFoundError = new (require('./errors/not_found'))("Order item was not found");
            next(notFoundError);
        })
        .catch(function (err) {
            next(err);
        });
});

router.get('/:orderItemId', function (req, res) {
    req.orderItem
        .load(['order.total', 'product'])
        .then(function () {
            res.json(req.orderItem);
        });
});

router.put('/:orderItemId', require('./middleware/auth_check'));

router.put('/:orderItemId', validator(require('./validation/order_items/update.json'), {source: 'body', param: 'updateForm'}));

router.put('/:orderItemId', function (req, res, next) {
    req.orderItem
        .save(req['updateForm'])
        .then(function (orderItemModel) {
            return orderItemModel.load(['product']);
        })
        .then(function (orderItemModel) {
            res.status(200).json(orderItemModel);
        });
});

module.exports = router;
