var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        "apiVersion":     "1.0",
        "swaggerVersion": "1.2",
        "apis":           [
            {
                "path":        "/auth",
                "description": "Auth resource"
            },
            {
                "path":        "/users",
                "description": "User resource"
            },
            {
                "path":        "/shops",
                "description": "Shop resource"
            }
        ],
        "info":           {
            "title":       "Mercher API Documentation",
            "description": "Mercher API Documentation",
            "contact":     "support@mercher.net"
        }
    });
});

router.use('/auth', require('./docs/resources/auth'));
router.use('/users', require('./docs/resources/users'));
router.use('/shops', require('./docs/resources/shops'));

module.exports = router;
