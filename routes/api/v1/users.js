var express = require('express');
var router = express.Router();
var UsersCollection = require('../../../collections/users');
var UserModel = require('../../../models/user');

router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    next();
});

router.get('/', function (req, res) {
    var usersCollection = new UsersCollection();
    usersCollection
        .fetch()
        .then(function (collection) {
            res.json(collection);
        });
});

router.param('userId', function (req, res, next, id) {
    var userModel = new UserModel({id: id});
    userModel.fetch({require: true})
        .then(function (model) {
            req.user = model;
            next();
        })
        .catch(UserModel.NotFoundError, function () {
            res.status(404).json(null);
        })
        .catch(function (err) {
            next(err);
        });
});

router.get('/:userId', function (req, res) {
    res.json(req.user);
});

module.exports = router;
