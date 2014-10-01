var express = require('express'),
    _ = require('underscore'),
    router = express.Router(),
    UserModel = require('../../../models/user'),
    AccessTokenModel = require('../../../models/access_token'),
    validator = require('../../../modules/express-async-validator/module');

router.post('/sign_up', validator(require('./validation/auth/sign_up.json'), {source: 'body', param: 'signUpForm'}));

router.post('/sign_up', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });
    next();
});

router.post('/sign_up', function (req, res, next) {
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

router.post('/basic', validator(require('./validation/auth/login.json'), {source: 'body', param: 'loginForm'}));

router.post('/basic', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });
    next();
});

router.post('/basic', function (req, res, next) {
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

router.post('/facebook', validator(require('./validation/auth/facebook.json'), {source: 'body', param: 'facebookAuthForm'}));

router.post('/facebook', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });
    next();
});

router.post('/facebook', function (req, res, next) {
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
