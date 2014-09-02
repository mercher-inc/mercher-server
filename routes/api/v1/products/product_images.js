var express = require('express'),
    router = express.Router(),
    busboy = require('connect-busboy'),
    ImageModel = require('../../../../models/image'),
    ProductImageModel = require('../../../../models/product_image');

router.use('/', busboy());

router.post('/', require('../middleware/auth_check'));

router.post('/', function (req, res) {
    var Promise = require('bluebird');

    var productImageModel = new ProductImageModel({"product_id": req.product.id});
    var promises = [];

    req.busboy.on('file', function (fieldname, file, filename) {
        promises.push(
            ImageModel
                .createImage(file, filename)
                .then(function (imageModel) {
                    productImageModel.set('image_id', imageModel.id);
                })
        );
    });

    req.busboy.on('field', function (key, value) {
        promises.push(
            new Promise(function (resolve) {
                productImageModel.set(key, value);
                resolve(productImageModel);
            })
        );
    });

    req.busboy.on('finish', function () {
        Promise.all(promises)
            .then(function () {
                productImageModel
                    .save({}, {req: req})
                    .then(function (productImageModel) {
                        new ProductImageModel({id: productImageModel.id})
                            .fetch({withRelated: ['image']})
                            .then(function (productImageModel) {
                                res.set('Location', '/api/v1/products/' + productImageModel.get('product_id') + '/product_images/' + productImageModel.id);
                                res.status(201).json(productImageModel);
                            });
                    });
            });
    });

    req.pipe(req.busboy);
});

module.exports = router;
