var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', false);
    next();
});

/* GET home page. */
router.get('/', function(req, res) {
    res.json({version: 1});
});

module.exports = router;
