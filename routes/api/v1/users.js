var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
    next();
});

/* GET home page. */
router.get('/', function(req, res) {
    res.json({user: 1});
});

module.exports = router;
