var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    Bookshelf = require('../../../modules/bookshelf'),
    PayPalAccountModel = require('../../../models/paypal_account'),
    ShopPayPalAuthRequestModel = require('../../../models/shop_paypal_auth_request'),
    validator = require('../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });
    next();
});

router.post('/register', validator(require('./validation/paypal_accounts/register.json'), {source: 'body', param: 'registerForm'}));

router.post('/register', function (req, res, next) {
    PayPalAccountModel
        .register(req['registerForm'])
        .then(function (payPalAccountModel) {
            res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/paypal_accounts/' + payPalAccountModel.id);
            res.status(201).json(payPalAccountModel);
        })
        .catch(function (e) {
            next(e);
        });
});

router.post('/request', validator(require('./validation/paypal_accounts/request.json'), {source: 'body', param: 'requestForm'}));

router.post('/request', function (req, res, next) {
    ShopPayPalAuthRequestModel
        .generate(req['requestForm'])
        .then(function (shopPayPalAuthRequestModel) {
            res.status(201).json(shopPayPalAuthRequestModel);
        })
        .catch(function (e) {
            next(e);
        });
});

module.exports = router;
