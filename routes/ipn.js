var express = require('express'),
    https = require('https'),
    qs = require('qs'),
    bodyParser = require('body-parser'),
    router = express.Router();

router.post('/', bodyParser.raw({type: 'application/*'}));

router.post('/', function (req, res, next) {
    res.status(200).send();

    console.log(req.body.toString());

    var ipnMessage = 'cmd=_notify-validate&' + req.body.toString(),
        ipnMessageData = qs.parse(ipnMessage);

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
