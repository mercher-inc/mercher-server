var express = require('express'),
    router = express.Router(),
    ProductImageModel = require('../../../models/product_image');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });
    next();
});

router.post('/', require('./middleware/auth_check'));

router.post('/', function (req, res, next) {
    new ProductImageModel()
        .save(req.body, {req: req})
        .then(function (productImageModel) {
            new ProductImageModel({id: productImageModel.id})
                .fetch({
                    withRelated: ['product', 'image']
                })
                .then(function (productImageModel) {
                    res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/product_images/' + productImageModel.id);
                    res.status(201).json(productImageModel);
                });
        })
        .catch(ProductImageModel.PermissionError, function (error) {
            var forbiddenError = new (require('./errors/forbidden'))(error.message);
            next(forbiddenError);
        })
        .catch(ProductImageModel.ValidationError, function (error) {
            var validationError = new (require('./errors/validation'))("Validation failed", error);
            next(validationError);
        })
        .catch(ProductImageModel.InternalServerError, function (error) {
            var internalServerError = new (require('./errors/internal'))(error.message);
            next(internalServerError);
        })
        .catch(function (error) {
            console.log(error);
            var internalServerError = new (require('./errors/internal'))();
            next(internalServerError);
        });
});

module.exports = router;
