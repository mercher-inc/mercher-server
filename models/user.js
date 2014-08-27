var bookshelf = require('../modules/bookshelf'),
    Promise = require('bluebird'),
    crypto = require('crypto'),
    expressAsyncValidator = require('../modules/express-async-validator/module'),
    salt = 'Mercher';

var UserModel = bookshelf.Model.extend(
    {
        tableName:     'user',
        hasTimestamps: true
    },
    {
        signUp: function (credentials) {
            var UserModel = this;
            return new Promise(function (resolve, reject) {
                new (expressAsyncValidator.model)(
                    {
                        "email":      {
                            "rules":      {
                                "required":     {
                                    "message": "Email is required"
                                },
                                "isEmail":      {
                                    "message": "Email should be a valid email address"
                                },
                                "uniqueRecord": {
                                    "message": "Email already used",
                                    "model":   UserModel,
                                    "field":   "email"
                                }
                            },
                            "allowEmpty": false
                        },
                        "password":   {
                            "rules":      {
                                "required": {
                                    "message": "Password is required"
                                },
                                "isLength": {
                                    "message": "Password should be between 8 and 40 characters long",
                                    "min":     8,
                                    "max":     40
                                }
                            },
                            "allowEmpty": false
                        },
                        "first_name": {
                            "rules":        {
                                "escape":   {},
                                "isLength": {
                                    "message": "First name should be less then 40 characters long",
                                    "min":     0,
                                    "max":     40
                                }
                            },
                            "allowEmpty":   true,
                            "defaultValue": null
                        },
                        "last_name":  {
                            "rules":        {
                                "escape":   {},
                                "isLength": {
                                    "message": "Last name should be less then 40 characters long",
                                    "min":     0,
                                    "max":     40
                                }
                            },
                            "allowEmpty":   true,
                            "defaultValue": null
                        }
                    }
                )
                    .validate(credentials)
                    .then(function (model) {
                        new UserModel({
                            email:      model.email,
                            password:   crypto.pbkdf2Sync(model.password, salt, 10, 20).toString('hex'),
                            first_name: model.first_name,
                            last_name:  model.last_name,
                            last_login: (new Date()).toISOString(),
                            is_admin:   false,
                            is_active:  false,
                            is_banned:  false
                        })
                            .save()
                            .then(function (userModel) {
                                require('./activation_code')
                                    .generate(userModel, 'email_activation');

                                resolve(userModel);
                            })
                    })
                    .catch(expressAsyncValidator.errors.modelValidationError, function (error) {
                        reject(error);
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
                        new UserModel()
                            .where({
                                email:    model.email,
                                password: crypto.pbkdf2Sync(model.password, salt, 10, 20).toString('hex')
                            })
                            .fetch({require: true})
                            .then(function (userModel) {
                                userModel
                                    .save({
                                        last_login: (new Date()).toISOString()
                                    })
                                    .then(function (userModel) {
                                        resolve(userModel);
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

module.exports = UserModel;