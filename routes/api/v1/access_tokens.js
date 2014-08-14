var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var UserModel = require('../../../models/user');
var AccessTokenModel = require('../../../models/access_token');

router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    next();
});

router.post('/', function (req, res) {
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

            var accessTokenModel = new AccessTokenModel({user_id: userModel.id, token: token});
            accessTokenModel
                .save().then(function (accessTokenModel) {
                    res.json(accessTokenModel);
                });
        })
        .catch(UserModel.NotFoundError, function () {
            res.status(404).json(null);
        });
});

module.exports = router;
