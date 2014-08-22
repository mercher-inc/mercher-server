var express = require('express'),
    crypto = require('crypto'),
    _ = require('underscore'),
    router = express.Router(),
    UserModel = require('../../../models/user'),
    AccessTokenModel = require('../../../models/access_token'),
    expressAsyncValidator = require('express-async-validator');

router.use('/sign_up', function (req, res, next) {
    req
        .model({
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
                        "model":   require('../../../models/user'),
                        "field":   "email"
                    }
                },
                "source":     ["body"],
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
                "source":     ["body"],
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
                "source":       ["body"],
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
                "source":       ["body"],
                "allowEmpty":   true,
                "defaultValue": null
            }
        })
        .validate()
        .then(function () {
            next();
        })
        .catch(function (error) {
            var validationError = new (require('./errors/validation'))("Validation failed", error);
            next(validationError);
        });
});

router.post('/sign_up', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });
    res.removeHeader('Access-Control-Allow-Origin');


    var userModel = new UserModel({
        email:      req.body.email,
        password:   crypto.pbkdf2Sync(req.body.password, 'Mercher', 10, 20).toString('hex'),
        first_name: req.body.first_name,
        last_name:  req.body.last_name
    });

    userModel
        .save()
        .then(function (userModel) {

            var hash = crypto.createHash('sha1');
            hash.update(Math.random().toString(), 'utf8');
            hash.update(new Date().toString(), 'utf8');
            var token = hash.digest('hex');

            var expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + 24 * 60 * 60 * 1000); // + 1 day
            var expires = expirationDate.toISOString();

            var accessTokenModel = new AccessTokenModel({
                user_id: userModel.id,
                token:   token,
                expires: expires
            });
            accessTokenModel
                .save().then(function (accessTokenModel) {
                    res.status(201).json({
                        "token":   accessTokenModel.get("token"),
                        "expires": accessTokenModel.get("expires")
                    });
                });
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
