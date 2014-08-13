var express = require('express');
var router = express.Router();
var UsersCollection = require('../../../collections/users');

router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    next();
});

/* GET home page. */
router.get('/', function (req, res) {
    var usersCollection = new UsersCollection();
    usersCollection
        .fetch()
        .then(function (collection) {
            res.json(collection);
        });
});

module.exports = router;
