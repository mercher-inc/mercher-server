var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    expressAsyncValidator = require('express-async-validator');

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

expressAsyncValidator.validators['meToUserId'] = function (param, value, options) {
    return new Promise(function (resolve, reject) {
        var AccessToken = require('../../models/access_token');
        var accessToken = new AccessToken({token: options.token});
        accessToken.fetch({require: true})
            .then(function (model) {
                resolve(model.get('user_id'));
            })
            .catch(AccessToken.NotFoundError, function () {
                reject(new (expressAsyncValidator.errors.fieldValidationError)(param, value, 'User is not authorized'));
            });
    });
};

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
