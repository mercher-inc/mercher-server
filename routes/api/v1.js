var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Access-Token');
    res.setHeader('Access-Control-Allow-Credentials', false);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

/* GET home page. */
router.get('/', function (req, res) {
    res.json({version: 1});
});

router.use('/access_tokens', require('./v1/access_tokens'));
router.use('/shops', require('./v1/shops'));
router.use('/users', require('./v1/users'));

module.exports = router;
