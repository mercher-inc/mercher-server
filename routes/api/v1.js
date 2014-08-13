var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Access-Token');
    res.setHeader('Access-Control-Allow-Credentials', false);
    res.type('json');
    next();
});

/* GET home page. */
router.get('/', function (req, res) {
    res.json({version: 1});
});

router.use('/users', require('./v1/users'));
router.use('/shops', require('./v1/shops'));

module.exports = router;
