var express = require('express'),
    crypto = require('crypto'),
    _ = require('underscore'),
    router = express.Router(),
    UserModel = require('../../../models/user'),
    AccessTokenModel = require('../../../models/access_token');

router.post('/basic', function (req, res) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });
    res.removeHeader('Access-Control-Allow-Origin');

    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email should be valid email').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Password should be 8-20 long').len(8, 20);

    var errors = req.validationErrors();
    if (errors) {
        var validationError = {
            "error":             406,
            "message":           "Validation failed",
            "validation_errors": []
        };
        var validationErrors = {};
        _.each(errors, function (element) {
            validationErrors[element.param] = validationErrors[element.param] || [];
            validationErrors[element.param].push(element.msg);
        });
        _.each(validationErrors, function (element, index) {
            validationError.validation_errors.push({
                "field":  index,
                "errors": element
            });
        });
        res.status(406).json(validationError);
        return;
    }

    var userModel = new UserModel();

    userModel
        .where({
            email:    req.body.email,
            password: crypto.pbkdf2Sync(req.body.password, 'Mercher', 10, 20).toString('hex')
        })
        .fetch({require: true})
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
        })
        .catch(UserModel.NotFoundError, function () {
            res.status(404).json(null);
        });
});

module.exports = router;
