var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    Bookshelf = require('../../../modules/bookshelf'),
    PayPalAccountModel = require('../../../models/paypal_account'),
    expressAsyncValidator = require('../../../modules/express-async-validator/module'),
    ShopPayPalAuthRequestModel = require('../../../models/shop_paypal_auth_request');

router.post('/', function (req, res, next) {
    PayPalAccountModel
        .register(req.body)
        .then(function (payPalAccountModel) {
            res.json(payPalAccountModel);
        })
        .catch(ShopPayPalAuthRequestModel.NotFoundError, function (e) {
            var notFoundError = new (require('./errors/not_found'))("PayPal Auth request was not found");
            next(notFoundError);
        })
        .catch(function (e) {
            res.json(e);
        });
});

module.exports = router;
