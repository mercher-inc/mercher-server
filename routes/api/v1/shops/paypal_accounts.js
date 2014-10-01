var express = require('express'),
    _ = require('underscore'),
    router = express.Router(),
    ShopModel = require('../../../../models/shop');

router.post('/request', function (req, res, next) {
    var PayPal = require('../../../../modules/paypal'),
        payPalClient = new PayPal,
        ShopPayPalAuthRequestModel = require('../../../../models/shop_paypal_auth_request'),
        shopPayPalAuthRequestModel = new ShopPayPalAuthRequestModel({shopId: req.shop.id});

    payPalClient
        .send('Permissions/RequestPermissions', {
            scope:    [
                'REFUND',
                'ACCESS_BASIC_PERSONAL_DATA',
                'ACCESS_ADVANCED_PERSONAL_DATA'
            ],
            callback: 'http://local.mercherdev.com/test'
        })
        .then(function (payPalResponse) {
            shopPayPalAuthRequestModel
                .save({requestToken: payPalResponse.token})
                .then(function (shopPayPalAuthRequestModel) {
                    res.location('https://sandbox.paypal.com/cgi-bin/webscr?cmd=_grant-permission&request_token=' + payPalResponse.token);
                    res.status(201).json(shopPayPalAuthRequestModel);
                });
        })
        .catch(function (e) {
            var internalServerError = new (require('../errors/internal'))(e);
            next(internalServerError);
        });
});

module.exports = router;
