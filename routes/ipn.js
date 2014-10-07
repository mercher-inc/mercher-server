var express = require('express'),
    https = require('https'),
    qs = require('querystring'),
    _ = require('underscore'),
    bodyParser = require('body-parser'),
    router = express.Router();

router.post('/', bodyParser.raw({type: 'application/*'}));

router.post('/', function (req, res, next) {
    res.status(200).send();

    console.log(req.body.toString());

    var ipnMessage = 'cmd=_notify-validate&' + req.body.toString(),
        ipnMessageData = qs.parse(req.body.toString());

    var ipnMessageNewData = {};
    _.each(ipnMessageData, function (value, key) {
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
            delete ipnMessageData[key];
        }
    });
    _.extend(ipnMessageData, ipnMessageNewData);

    console.info(ipnMessageData);

    var payPalRequestOptions = {
        host:    (ipnMessageData['test_ipn']) ? 'www.sandbox.paypal.com' : 'www.paypal.com',
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

module.exports = router;
