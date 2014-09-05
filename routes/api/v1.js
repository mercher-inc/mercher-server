var express = require('express'),
    router = express.Router(),
    expressAsyncValidator = require('../../modules/express-async-validator/module'),
    Promise = require('bluebird');

expressAsyncValidator.validators.uniqueRecord = function (param, value, options) {
    return new Promise(function (resolve, reject) {
        var query = {};
        query[options.field] = value;
        var model = new options.model(query);
        model
            .fetch({require: true})
            .then(function () {
                reject(new (expressAsyncValidator.errors.fieldValidationError)(param, value, options.message));
            })
            .catch(options.model.NotFoundError, function () {
                resolve(value);
            });
    });
};

router.use(function (req, res, next) {
    if (!req.get('X-Access-Token')) {
        next();
        return;
    }
    var AccessToken = require('../../models/access_token');
    new AccessToken()
        .where({token: req.get('X-Access-Token')})
        .fetch({require: true})
        .then(function (accessToken) {
            //everything is ok, getting user
            var User = require('../../models/user');
            new User({id: accessToken.get('user_id')})
                .fetch({require: true})
                .then(function (user) {
                    req.currentUser = user;
                    next();
                })
                .catch(User.NotFoundError, function () {
                    next();
                });
        })
        .catch(AccessToken.NotFoundError, function () {
            next();
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

router.get('/env', function (req, res, next) {
    res.json(process.env);
});

router.use('/auth', require('./v1/auth'));
router.use('/images', require('./v1/images'));
router.use('/users', require('./v1/users'));
router.use('/shops', require('./v1/shops'));
router.use('/managers', require('./v1/managers'));
router.use('/products', require('./v1/products'));
router.use('/product_images', require('./v1/product_images'));

// documentation
router.use('/docs', require('./v1/docs'));

router.use(function (err, req, res, next) {
    if (err instanceof require('./v1/errors/api_error')) {
        res.status(err.status).json(err.error);
        return;
    }
    next(err);
});

module.exports = router;
