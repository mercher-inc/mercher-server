var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    Bookshelf = require('../../../modules/bookshelf'),
    PayPalAccountModel = require('../../../models/paypal_account'),
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
            res.json(payPalAccountModel);
        })
        .catch(function (e) {
            next(e);
        });
});

module.exports = router;
