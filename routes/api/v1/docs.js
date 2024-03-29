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
                "path":        "/shop_reviews",
                "description": "Shop Review resource"
            },
            {
                "path":        "/products",
                "description": "Product resource"
            },
            {
                "path":        "/product_images",
                "description": "Product Image resource"
            },
            {
                "path":        "/product_reviews",
                "description": "Product Review resource"
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
                "path":        "/orders",
                "description": "Order resource"
            },
            {
                "path":        "/order_items",
                "description": "Order Item resource"
            },
            {
                "path":        "/images",
                "description": "Image resource"
            },
            {
                "path":        "/paypal_accounts",
                "description": "PayPal accounts resource"
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
router.use('/shop_reviews', require('./docs/resources/shop_reviews'));
router.use('/products', require('./docs/resources/products'));
router.use('/product_images', require('./docs/resources/product_images'));
router.use('/product_reviews', require('./docs/resources/product_reviews'));
router.use('/categories', require('./docs/resources/categories'));
router.use('/managers', require('./docs/resources/managers'));
router.use('/orders', require('./docs/resources/orders'));
router.use('/order_items', require('./docs/resources/order_items'));
router.use('/images', require('./docs/resources/images'));
router.use('/paypal_accounts', require('./docs/resources/paypal_accounts'));

module.exports = router;
