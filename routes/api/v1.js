var express = require('express'),
    router = express.Router(),
    expressAsyncValidator = require('express-async-validator'),
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
router.use('/shops', require('./v1/shops'));
router.use('/users', require('./v1/users'));

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
