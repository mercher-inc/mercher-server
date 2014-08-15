var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var UserModel = require('../../../models/user');
var AccessTokenModel = require('../../../models/access_token');

router.post('/basic', function (req, res) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });
    res.removeHeader('Access-Control-Allow-Origin');

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
