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

router.post('/facebook', function (req, res, next) {

    var FB = require('fb'),
        fbAccessToken = req.query.access_token;

    FB.api('oauth/access_token', {
        client_id:     process.env.FB_APP_ID,
        client_secret: process.env.FB_APP_SECRET,
        grant_type:    'client_credentials'
    }, function (response) {
        FB.api('debug_token', {
            input_token:  fbAccessToken,
            access_token: response.access_token
        }, function (response) {
            if (response.data.app_id == process.env.FB_APP_ID && response.data.is_valid) {
                var User = require('../../../models/user'),
                    UserThirdPartyAccountModel = require('../../../models/user_third_party_account'),
                    fbUserId = response.data.user_id;

                new UserThirdPartyAccountModel({provider: 'facebook', provider_id: fbUserId})
                    .fetch({require: true})
                    .then(function (userThirdPartyAccountModel) {
                        return userThirdPartyAccountModel;
                    })
                    .catch(UserThirdPartyAccountModel.NotFoundError, function () {
                        var Promise = require('bluebird');
                        return new Promise(function (resolve, reject) {
                            FB.api('me', {
                                access_token: fbAccessToken
                            }, function (response) {
                                if (!response || response.error) {
                                    reject(response.error);
                                    return;
                                }
                                var user = new User();
                                if (response.first_name) {
                                    user.set('first_name', response.first_name);
                                }
                                if (response.last_name) {
                                    user.set('last_name', response.last_name);
                                }
                                user
                                    .save()
                                    .then(function (user) {
                                        new UserThirdPartyAccountModel()
                                            .save({
                                                user_id:     user.id,
                                                provider:    'facebook',
                                                provider_id: response.id
                                            })
                                            .then(function (userThirdPartyAccountModel) {
                                                resolve(userThirdPartyAccountModel);
                                            });
                                    });
                            });
                        });
                    })
                    .then(function (userThirdPartyAccountModel) {
                        return userThirdPartyAccountModel.load('user');
                    })
                    .then(function (userThirdPartyAccountModel) {
                        return userThirdPartyAccountModel.related('user');
                    })
                    .then(function (user) {
                        return user.save({
                            last_login: (new Date()).toISOString()
                        });
                    })
                    .then(function (user) {
                        var AccessTokenModel = require('../../../models/access_token');
                        return AccessTokenModel.grant(user);
                    })
                    .then(function (accessTokenModel) {
                        res.status(201).json({
                            "token":   accessTokenModel.get("token"),
                            "expires": accessTokenModel.get("expires")
                        });
                    });
            }
        });
    });
});

module.exports = router;
