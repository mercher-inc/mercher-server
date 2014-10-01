var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base'),
    Promise = require('bluebird'),
    crypto = require('crypto'),
    expressAsyncValidator = require('../modules/express-async-validator/module'),
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
        },

        validateUpdating: function (userModel, attrs, options) {
            return new Promise(function (resolve, reject) {
                userModel
                    .checkPermission(options.req.currentUser)
                    .then(function () {
                        new (expressAsyncValidator.model)(validateUpdatingConfig)
                            .validate(attrs)
                            .then(function (attrs) {
                                resolve(attrs);
                            })
                            .catch(expressAsyncValidator.errors.modelValidationError, function (error) {
                                reject(new UserModel.ValidationError("User validation failed", error.fields));
                            })
                            .catch(function () {
                                reject(new UserModel.InternalServerError());
                            });
                    })
                    .catch(UserModel.PermissionError, function (error) {
                        reject(new UserModel.PermissionError("You are not allowed to modify this user"));
                    })
                    .catch(function () {
                        reject(new UserModel.InternalServerError());
                    });
            });
        },
        checkPermission:  function (currentUserModel) {
            var userModel = this,
                userId = userModel.get('id'),
                currentUserId = currentUserModel.get('id');
            return new Promise(function (resolve, reject) {
                if (userId === currentUserId) {
                    resolve(userModel);
                } else {
                    reject(new UserModel.PermissionError());
                }
            });
        }
    },
    {
        signUp: function (credentials) {
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
        login:  function (credentials) {
            var UserModel = this;
            return new Promise(function (resolve, reject) {
                new (expressAsyncValidator.model)(
                    {
                        "email":    {
                            "rules":      {
                                "required": {
                                    "message": "Email is required"
                                },
                                "isEmail":  {
                                    "message": "Email should be a valid email address"
                                }
                            },
                            "allowEmpty": false
                        },
                        "password": {
                            "rules":      {
                                "required": {
                                    "message": "Password is required"
                                }
                            },
                            "allowEmpty": false
                        }
                    }
                )
                    .validate(credentials)
                    .then(function (model) {
                        new UserEmailModel()
                            .where({
                                email:    model.email,
                                password: crypto.pbkdf2Sync(model.password, salt, 10, 20).toString('hex')
                            })
                            .fetch({require: true})
                            .then(function (userEmailModel) {
                                new UserModel({id: userEmailModel.get('userId')})
                                    .fetch()
                                    .then(function (userModel) {
                                        userModel
                                            .save({
                                                lastLogin: (new Date()).toISOString()
                                            })
                                            .then(function (userModel) {
                                                resolve(userModel);
                                            });
                                    });
                            })
                            .catch(UserModel.NotFoundError, function (error) {
                                reject(error);
                            });
                    })
                    .catch(expressAsyncValidator.errors.modelValidationError, function (error) {
                        reject(error);
                    });
            });
        }
    }
);

var validateUpdatingConfig = {
    "imageId": {
        "rules":        {
            "isInt": {
                "message": "Image ID should be integer"
            },
            "toInt": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    }
};

module.exports = UserModel;
