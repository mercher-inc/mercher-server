var bookshelf = require('../modules/bookshelf'),
    Promise = require('bluebird'),
    crypto = require('crypto'),
    expressAsyncValidator = require('express-async-validator'),
    salt = 'Mercher';

var UserModel = bookshelf.Model.extend(
    {
        tableName:     'user',
        hasTimestamps: true
    },
    {
        login: function (credentials) {
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
                                resolve(userModel);
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