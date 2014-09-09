var app = require('../app'),
    bookshelf = app.get('bookshelf'),
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
        tableName:     'user',
        hasTimestamps: true,
        image:         function () {
            return this.belongsTo(ImageModel);
        },
        emails:        function () {
            return this.hasMany(UserEmailModel);
        },
        images:        function () {
            return this.hasMany(ImageModel);
        },

        initialize:       function () {
            this.on('updated', function(){
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
                                    "model":   UserEmailModel,
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
                        new UserModel()
                            .save({
                                first_name: model.first_name,
                                last_name:  model.last_name,
                                last_login: (new Date()).toISOString(),
                                is_banned:  false
                            })
                            .then(function (userModel) {
                                new UserEmailModel()
                                    .save({
                                        user_id:   userModel.id,
                                        email:     model.email,
                                        password:  crypto.pbkdf2Sync(model.password, salt, 10, 20).toString('hex'),
                                        is_active: false
                                    })
                                    .then(function (userEmailModel) {
                                        require('./activation_code')
                                            .generate(userEmailModel, 'email_activation');
                                        resolve(userModel);
                                    });
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
                        new UserEmailModel()
                            .where({
                                email:    model.email,
                                password: crypto.pbkdf2Sync(model.password, salt, 10, 20).toString('hex')
                            })
                            .fetch({require: true})
                            .then(function (userEmailModel) {
                                new UserModel({id: userEmailModel.get('user_id')})
                                    .fetch()
                                    .then(function (userModel) {
                                        userModel
                                            .save({
                                                last_login: (new Date()).toISOString()
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
    "image_id": {
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
