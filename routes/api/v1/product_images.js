var express = require('express'),
    router = express.Router(),
    ProductImageModel = require('../../../models/product_image'),
    validator = require('../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });
    next();
});

router.post('/', require('./middleware/auth_check'));

router.post('/', validator(require('./validation/product_images/create.json'), {source: 'body', param: 'createForm'}));

router.post('/', function (req, res, next) {
    new ProductImageModel()
        .save(req['createForm'])
        .then(function (productImageModel) {
            return productImageModel.load(['product', 'image']);
        })
        .then(function (productImageModel) {
            res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/product_images/' + productImageModel.id);
            res.status(201).json(productImageModel);
        });
});

module.exports = router;
