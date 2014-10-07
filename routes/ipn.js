var express = require('express'),
    https = require('https'),
    qs = require('querystring'),
    Promise = require('bluebird'),
    _ = require('underscore'),
    bodyParser = require('body-parser'),
    router = express.Router();

router.post('/', bodyParser.raw({type: 'application/*'}));

router.post('/', function (req, res, next) {
    res.status(200).send();
    next();
});

router.post('/', function (req, res, next) {
    var ipnMessage = 'cmd=_notify-validate&' + req.body.toString();
    req.ipnMessage = qs.parse(req.body.toString());

    var ipnMessageNewData = {};
    _.each(req.ipnMessage, function (value, key) {
        if (key.match(/(\[\d+\]|\.)/g)) {
            var newKey = key.replace(/\[/g, '.').replace(/\]\./g, '.').replace(/\]/g, '.');
            var keyPath = newKey.split('.');
            var j = ipnMessageNewData;
            for (var i = 0; i < keyPath.length; i++) {
                if (i == keyPath.length - 1) {
                    j[keyPath[i]] = value;
                } else {
                    if (!j[keyPath[i]]) {
                        if (keyPath[i + 1].match(/^\d+$/)) {
                            j[keyPath[i]] = [];
                        } else {
                            j[keyPath[i]] = {};
                        }
                    }
                    j = j[keyPath[i]];
                }
            }
            delete req.ipnMessage[key];
        }
    });
    _.extend(req.ipnMessage, ipnMessageNewData);

    console.info(req.ipnMessage);

    var payPalRequestOptions = {
        host:    (req.ipnMessage['test_ipn']) ? 'www.sandbox.paypal.com' : 'www.paypal.com',
        method:  'POST',
        path:    '/cgi-bin/webscr',
        headers: {'Content-Length': ipnMessage.length}
    };

    var payPalRequest = https.request(payPalRequestOptions, function (payPalResponse) {
        payPalResponse.on('data', function (d) {
            if (d.toString() === 'VERIFIED') {
                next();
            }
        });
    });
    payPalRequest.write(ipnMessage);
    payPalRequest.end();
    payPalRequest.on('error', function (e) {
        next(e);
    });
});

router.post('/', function (req, res, next) {
    if (req.ipnMessage['action_type'] !== 'PAY' && req.ipnMessage['action_type'] !== 'CREATE') {
        next();
        return;
    }

    var OrderModel = require('../models/order'),
        UserModel = require('../models/user'),
        UserEmailModel = require('../models/user_email');

    new OrderModel({payKey: req.ipnMessage['pay_key']})
        .fetch({require: true})
        .then(function (orderModel) {
            switch (req.ipnMessage['status']) {
                case 'CANCELED':
                    orderModel.set({
                        status:  'canceled',
                        expires: null
                    });
                    break;
                case 'CREATED':
                case 'PROCESSING':
                case 'PENDING':
                    orderModel.set({
                        status: 'pending'
                    });
                    break;
                case 'COMPLETED':
                    orderModel.set({
                        status:  'submitted',
                        expires: null
                    });
                    break;
                case 'INCOMPLETE':
                case 'ERROR':
                case 'REVERSALERROR':
                default:
                    orderModel.set({
                        status:  'error',
                        expires: null
                    });
                    break;
            }
            return orderModel.save({
                paymentExecStatus: req.ipnMessage['status'],
                reason:            req.ipnMessage['reason_code'] ? req.ipnMessage['reason_code'] : null,
                memo:              req.ipnMessage['memo'] ? req.ipnMessage['memo'] : null
            });
        })
        .then(function (orderModel) {
            return orderModel.load('transactions');
        })
        .then(function (orderModel) {
            _.each(req.ipnMessage['transaction'], function (transaction) {
                orderModel.related('transactions').add({data: transaction});
            });
            return orderModel.related('transactions').invokeThen('save').then(function () {
                return orderModel;
            });
        })
        .then(function (orderModel) {
            if (!orderModel.get('userId')) {
                return new UserEmailModel({email: req.ipnMessage['sender_email']})
                    .fetch({require: true})
                    .then(function (userEmailModel) {
                        return orderModel.save({userId: userEmailModel.get('userId')});
                    })
                    .catch(UserEmailModel.NotFoundError, function () {
                        return new UserModel().save()
                            .then(function (userModel) {
                                return Promise.all([
                                    new UserEmailModel().save({userId: userModel.id, email: req.ipnMessage['sender_email']}),
                                    orderModel.save({userId: userModel.id})
                                ]).then(function () {
                                    return orderModel;
                                });
                            });
                    });
            } else {
                return orderModel;
            }
        })
        .catch(OrderModel.NotFoundError, function (e) {
            next(e);
        });
});

router.post('/', function (err, req, res, next) {
    console.error(err);
});

module.exports = router;
