var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base'),
    Promise = require('bluebird'),
    crypto = require('crypto'),
    salt = 'Mercher',
    ImageModel = require('./image'),
    UserEmailModel = require('./user_email');

var UserModel = BaseModel.extend(
    {
        tableName: 'user',
        defaults:  {
            imageId:    null,
            firstName:  null,
            lastName:   null,
            gender:     null,
            last_login: null,
            isBanned:   false
        },

        image:  function () {
            return this.belongsTo(ImageModel);
        },
        emails: function () {
            return this.hasMany(UserEmailModel);
        },
        images: function () {
            return this.hasMany(ImageModel);
        },

        initialize: function () {
            this.on('updated', function () {
                io.sockets.emit('user updated', this);
            });
        }
    },
    {
        signUp:       function (credentials) {
            var UserModel = this,
                UserEmailModel = require('./user_email'),
                ActivationCodeModel = require('./activation_code'),
                queue = require('../modules/queue');

            return new UserModel()
                .save({
                    firstName: credentials.firstName,
                    lastName:  credentials.lastName,
                    lastLogin: (new Date()).toISOString(),
                    isBanned:  false
                })
                .then(function (userModel) {
                    return new UserEmailModel()
                        .save({
                            userId:   userModel.id,
                            email:    credentials.email,
                            password: crypto.pbkdf2Sync(credentials.password, salt, 10, 20).toString('hex'),
                            isActive: false
                        })
                        .then(function (userEmailModel) {
                            return ActivationCodeModel.generate(userEmailModel, 'email_activation');
                        })
                        .then(function (activationCodeModel) {
                            queue
                                .create('send email', {
                                    type:             'activation_code',
                                    activationCodeId: activationCodeModel.id
                                })
                                .save();

                            return userModel;
                        });
                });
        },
        login:        function (credentials) {
            var UserEmailModel = require('./user_email');

            return new UserEmailModel()
                .where({
                    email:    credentials.email,
                    password: crypto.pbkdf2Sync(credentials.password, salt, 10, 20).toString('hex')
                })
                .fetch({require: true, withRelated: ['user']})
                .then(function (userEmailModel) {
                    return userEmailModel
                        .related('user')
                        .save({
                            lastLogin: (new Date()).toISOString()
                        });
                });
        },
        facebookAuth: function (credentials) {
            var FB = require('fb'),
                UserModel = this,
                UserThirdPartyAccountModel = require('./user_third_party_account');

            return new Promise(function (resolve, reject) {
                FB.api('oauth/access_token', {
                    client_id:     process.env['FB_APP_ID'],
                    client_secret: process.env['FB_APP_SECRET'],
                    grant_type:    'client_credentials'
                }, function (response) {
                    FB.api('debug_token', {
                        input_token:  credentials.fbAccessToken,
                        access_token: response.access_token
                    }, function (response) {
                        var fbUserId = response.data['user_id'];
                        if (response.data['app_id'] == process.env['FB_APP_ID'] && response.data['is_valid']) {
                            new UserThirdPartyAccountModel({provider: 'facebook', providerId: fbUserId})
                                .fetch({require: true})
                                .then(function (userThirdPartyAccountModel) {
                                    return userThirdPartyAccountModel;
                                })
                                .catch(UserThirdPartyAccountModel.NotFoundError, function () {
                                    var Promise = require('bluebird');
                                    return new Promise(function (resolve, reject) {
                                        FB.api('me', {
                                            access_token: credentials.fbAccessToken
                                        }, function (response) {
                                            if (!response || response.error) {
                                                reject(response.error);
                                                return;
                                            }
                                            var user = new UserModel();
                                            if (response.first_name) {
                                                user.set('firstName', response.first_name);
                                            }
                                            if (response.last_name) {
                                                user.set('lastName', response.last_name);
                                            }
                                            user
                                                .save()
                                                .then(function (user) {
                                                    new UserThirdPartyAccountModel()
                                                        .save({
                                                            userId:     user.id,
                                                            provider:   'facebook',
                                                            providerId: response.id
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
                                        lastLogin: (new Date()).toISOString()
                                    });
                                })
                                .then(function (user) {
                                    resolve(user);
                                });
                        }
                    });
                });
            });
        }
    }
);

module.exports = UserModel;
