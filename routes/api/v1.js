var express = require('express'),
    router = express.Router(),
    validator = require('../../modules/express-async-validator/module'),
    Promise = require('bluebird'),
    app = require('../../app'),
    Bookshelf = app.get('bookshelf'),
    knex = Bookshelf.knex;

validator.validators.uniqueRecord = function (param, value, options) {
    return new Promise(function (resolve, reject) {
        knex(options.table)
            .where(options.field, value)
            .count(options.field)
            .then(function (result) {
                if (parseInt(result[0].count)) {
                    reject(new (validator.errors.fieldValidationError)(param, value, options.message));
                } else {
                    resolve(value);
                }
            });
    });
};

validator.validators.recordExists = function (param, value, options) {
    return new Promise(function (resolve, reject) {
        knex(options.table)
            .where(options.field, value)
            .count(options.field)
            .then(function (result) {
                if (!parseInt(result[0].count)) {
                    reject(new (validator.errors.fieldValidationError)(param, value, options.message));
                } else {
                    resolve(value);
                }
            });
    });
};

router.use(function (req, res, next) {
    if (!req.get('X-Access-Token')) {
        next();
        return;
    }
    var AccessToken = require('../../models/access_token'),
        expirationDate = new Date();
    new AccessToken()
        .where({token: req.get('X-Access-Token')})
        .where('expires', '>=', expirationDate.toISOString())
        .fetch({require: true, withRelated: ['user']})
        .then(function (accessTokenModel) {
            //everything is ok, updating expiration time
            expirationDate.setTime(expirationDate.getTime() + 24 * 60 * 60 * 1000); // + 1 day
            return accessTokenModel.save({expires: expirationDate.toISOString()});
        })
        .then(function (accessTokenModel) {
            //setting current user
            req.currentUser = accessTokenModel.related('user');
            next();
        })
        .catch(AccessToken.NotFoundError, function () {
            //access token not found or expired
            next();
        })
        .catch(function (e) {
            //unknown error
            next(e);
        });
});

router.use(function (req, res, next) {
    res.set({
        'Access-Control-Allow-Origin':      '*',
        'Access-Control-Allow-Methods':     'GET',
        'Access-Control-Allow-Headers':     'X-Access-Token',
        'Access-Control-Allow-Credentials': false,
        'Content-Type':                     'application/json; charset=utf-8'
    });
    next();
});

router.use('/auth', require('./v1/auth'));
router.use('/images', require('./v1/images'));
router.use('/categories', require('./v1/categories'));
router.use('/users', require('./v1/users'));
router.use('/shops', require('./v1/shops'));
router.use('/managers', require('./v1/managers'));
router.use('/products', require('./v1/products'));
router.use('/product_images', require('./v1/product_images'));
router.use('/orders', require('./v1/orders'));
router.use('/order_items', require('./v1/order_items'));
router.use('/paypal_accounts', require('./v1/paypal_accounts'));

// documentation
router.use('/docs', require('./v1/docs'));

router.use(function (req, res, next) {
    next(new (require('./v1/errors/not_found'))("Edge was not found"));
});

router.use(function (err, req, res, next) {
    if (err instanceof validator.errors.modelValidationError) {
        res.status(406).json(err);
        return;
    }

    if (err instanceof require('./v1/errors/api_error')) {
        res.status(err.status).json(err.error);
        return;
    }

    next(err);
});

module.exports = router;
