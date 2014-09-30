var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    Bookshelf = require('../../../modules/bookshelf'),
    PayPalAccountModel = require('../../../models/paypal_account'),
    expressAsyncValidator = require('../../../modules/express-async-validator/module');

router.post('/', function (req, res, next) {
    PayPalAccountModel
        .register(req.body)
        .then(function (payPalAccountModel) {
            res.json(payPalAccountModel);
        })
        .catch(function (e) {
            res.json(e);
        });
});

module.exports = router;
