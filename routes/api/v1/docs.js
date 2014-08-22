var express = require('express'),
    router = express.Router();

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
            },
            {
                "path":        "/products",
                "description": "Product resource"
            },
            {
                "path":        "/categories",
                "description": "Category resource"
            },
            {
                "path":        "/managers",
                "description": "Manager resource"
            },
            {
                "path":        "/craftsmen",
                "description": "Craftsman resource"
            },
            {
                "path":        "/images",
                "description": "Image resource"
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
router.use('/products', require('./docs/resources/products'));
router.use('/categories', require('./docs/resources/categories'));
router.use('/managers', require('./docs/resources/managers'));
router.use('/craftsmen', require('./docs/resources/craftsmen'));
router.use('/images', require('./docs/resources/images'));

module.exports = router;
