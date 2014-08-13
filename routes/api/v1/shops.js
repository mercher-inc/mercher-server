var express = require('express');
var router = express.Router();
var ShopsCollection = require('../../../collections/shops');

router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    next();
});

/* GET home page. */
router.get('/', function(req, res) {
    var shopsCollection = new ShopsCollection();
    shopsCollection
        .fetch()
        .then(function (collection) {
            res.json(collection);
        });
});

module.exports = router;
