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

router.post('/ipn', function (req, res, next) {
    res.status(200).send();

    var https = require('https'),
        qs = require('qs'),
        _ = require('underscore'),
        ipnMessage = qs.stringify(_.extend({'cmd': '_notify-validate'}, req.body));

    console.info(req.body, ipnMessage);

    var payPalRequestOptions = {
        host:    (ipnMessage['test_ipn']) ? 'www.sandbox.paypal.com' : 'www.paypal.com',
        method:  'POST',
        path:    '/cgi-bin/webscr',
        headers: {'Content-Length': ipnMessage.length}
    };

    console.info(payPalRequestOptions);

    var payPalRequest = https.request(payPalRequestOptions, function (payPalResponse) {
        payPalResponse.on('data', function (d) {
            console.log(d.toString());
        });
    });
    payPalRequest.write(ipnMessage);
    payPalRequest.end();
    payPalRequest.on('error', function (e) {
        console.log(e);
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

router.post('/:orderId/pay', validator(require('./validation/orders/pay.json'), {source: 'body', param: 'payForm'}));

router.post('/:orderId/pay', function (req, res, next) {
    req['payForm'].ipnNotificationUrl = (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/orders/ipn';
    req.order.pay(req['payForm'])
        .then(function (orderModel) {
            res.json(orderModel);
        })
        .catch(function (e) {
            next(e);
        });
});

router.put('/:orderId', require('./middleware/auth_check'));

router.put('/:orderId', validator(require('./validation/orders/update.json'), {source: 'body', param: 'updateForm'}));

router.put('/:orderId', function (req, res, next) {
    req.order
        .save(req['updateForm'])
        .then(function (orderModel) {
            return orderModel.load(['total', 'user.image', 'shop.image', 'orderItems.product']);
        })
        .then(function (orderModel) {
            res.status(200).json(orderModel);
        });
});

router.use('/:orderId/order_items', require('./orders/order_items'));

module.exports = router;
