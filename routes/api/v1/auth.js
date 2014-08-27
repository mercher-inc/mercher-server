var express = require('express'),
    _ = require('underscore'),
    router = express.Router(),
    UserModel = require('../../../models/user'),
    AccessTokenModel = require('../../../models/access_token'),
    expressAsyncValidator = require('../../../modules/express-async-validator/module');

router.post('/sign_up', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });
    res.removeHeader('Access-Control-Allow-Origin');

    UserModel
        .signUp(req.body)
        .then(function (userModel) {
            AccessTokenModel
                .grant(userModel)
                .then(function (accessTokenModel) {
                    res.status(201).json({
                        "token":   accessTokenModel.get("token"),
                        "expires": accessTokenModel.get("expires")
                    });
                });
        })
        .catch(expressAsyncValidator.errors.modelValidationError, function (error) {
            var validationError = new (require('./errors/validation'))("Validation failed", error);
            next(validationError);
        });
});

router.post('/basic', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });
    res.removeHeader('Access-Control-Allow-Origin');

    UserModel
        .login(req.body)
        .then(function (userModel) {
            AccessTokenModel
                .grant(userModel)
                .then(function (accessTokenModel) {
                    res.status(201).json({
                        "token":   accessTokenModel.get("token"),
                        "expires": accessTokenModel.get("expires")
                    });
                });
        })
        .catch(UserModel.NotFoundError, function () {
            var notFoundError = new (require('./errors/not_found'))("User with these credentials was not found");
            next(notFoundError);
        })
        .catch(expressAsyncValidator.errors.modelValidationError, function (error) {
            var validationError = new (require('./errors/validation'))("Validation failed", error);
            next(validationError);
        });
});

module.exports = router;
