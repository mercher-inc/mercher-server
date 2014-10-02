var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    OrderModel = require('../../../models/order'),
    validator = require('../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });
    next();
});

router.post('/', require('./middleware/auth_check'));

router.post('/', validator(require('./validation/orders/create.json'), {source: 'body', param: 'createForm'}));

router.post('/', function (req, res, next) {
    new OrderModel()
        .save(req['createForm'])
        .then(function (orderModel) {
            return orderModel.load(['total', 'user.image', 'shop.image', 'orderItems.product']);
        })
        .then(function (orderModel) {
            res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/orders/' + orderModel.id);
            res.status(201).json(orderModel);
        });
});

router.use('/:orderId', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,PUT,DELETE'
    });
    next();
});

router.param('orderId', function (req, res, next) {
    var orderModel = new OrderModel({id: parseInt(req.params.orderId)});
    orderModel.fetch({require: true})
        .then(function (model) {
            req.order = model;
            next();
        })
        .catch(OrderModel.NotFoundError, function () {
            var notFoundError = new (require('./errors/not_found'))("Order was not found");
            next(notFoundError);
        })
        .catch(function (err) {
            next(err);
        });
});

router.get('/:orderId', function (req, res) {
    req.order
        .load(['total', 'user.image', 'shop.image', 'orderItems.product'])
        .then(function () {
            res.json(req.order);
        });
});

router.put('/:orderId', require('./middleware/auth_check'));

router.put('/:orderId', function (req, res, next) {
    req.order
        .save(req.body, {req: req})
        .then(function (orderModel) {
            new OrderModel({id: orderModel.id})
                .fetch({
                    withRelated: ['total', 'user.image', 'shop.image', 'orderItems.product']
                })
                .then(function (orderModel) {
                    res.status(200).json(orderModel);
                });
        })
        .catch(OrderModel.PermissionError, function (error) {
            var forbiddenError = new (require('./errors/forbidden'))(error.message);
            next(forbiddenError);
        })
        .catch(OrderModel.ValidationError, function (error) {
            var validationError = new (require('./errors/validation'))("Validation failed", error);
            next(validationError);
        })
        .catch(OrderModel.InternalServerError, function (error) {
            var internalServerError = new (require('./errors/internal'))(error.message);
            next(internalServerError);
        })
        .catch(function (error) {
            var internalServerError = new (require('./errors/internal'))();
            next(internalServerError);
        });
});

router.use('/:orderId/order_items', require('./orders/order_items'));

module.exports = router;
