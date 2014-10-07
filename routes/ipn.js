var express = require('express'),
    https = require('https'),
    qs = require('querystring'),
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
    if (req.ipnMessage['action_type'] !== 'PAY') {
        next();
        return;
    }

    var OrderModel = require('../models/order');
    new OrderModel({payKey: req.ipnMessage['pay_key'], id: req.ipnMessage['tracking_id']})
        .fetch({require: true})
        .then(function (orderModel) {
            if (req.ipnMessage['status'] === 'COMPLETED') {
                return orderModel.save({status: 'submitted'});
            }
        })
        .catch(function (e) {
            next(e);
        });
});

router.post('/', function (err, req, res, next) {
    console.error(err);
});

module.exports = router;
