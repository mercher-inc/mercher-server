var express = require('express'),
    _ = require('underscore'),
    router = express.Router(),
    UserModel = require('../../../models/user'),
    AccessTokenModel = require('../../../models/access_token'),
    validator = require('../../../modules/express-async-validator/module');

router.post('/sign_up', validator.middleware(require('./validation/auth/sign_up.json'), {param: 'signUpForm'}));

router.post('/sign_up', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });

    UserModel
        .signUp(req['signUpForm'])
        .then(function (userModel) {
            AccessTokenModel
                .grant(userModel)
                .then(function (accessTokenModel) {
                    res.status(201).json({
                        "token":   accessTokenModel.get("token"),
                        "expires": accessTokenModel.get("expires")
                    });
                });
        });
});

router.post('/basic', validator.middleware(require('./validation/auth/login.json'), {param: 'loginForm'}));

router.post('/basic', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });

    var UserEmailModel = require('../../../models/user_email');

    UserModel
        .login(req['loginForm'])
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
        .catch(UserEmailModel.NotFoundError, function () {
            next(new (require('./errors/not_found'))('Email/password pair is incorrect'));
        });
});

router.post('/facebook', validator.middleware(require('./validation/auth/facebook.json'), {param: 'facebookAuthForm'}));

router.post('/facebook', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });

    UserModel
        .facebookAuth(req['facebookAuthForm'])
        .then(function (userModel) {
            AccessTokenModel
                .grant(userModel)
                .then(function (accessTokenModel) {
                    res.status(201).json({
                        "token":   accessTokenModel.get("token"),
                        "expires": accessTokenModel.get("expires")
                    });
                });
        });
});

module.exports = router;
