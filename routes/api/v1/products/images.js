var express = require('express'),
    router = express.Router(),
    busboy = require('connect-busboy'),
    ImageModel = require('../../../../models/image'),
    ProductImageModel = require('../../../../models/product_image');

router.use('/', busboy());
router.post('/', require('../middleware/auth_check'));

router.post('/', function (req, res) {

    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {

        ImageModel
            .createImage(file, filename)
            .then(function (imageModel) {
                new ProductImageModel()
                    .save({"product_id": req.product.id, "image_id": imageModel.id})
                    .then(function (productImageModel) {
                        new ProductImageModel({id: productImageModel.id})
                            .fetch({withRelated: ['image']})
                            .then(function (productImageModel) {
                                res.set('Location', '/api/v1/products/' + productImageModel.get('product_id') + '/images/' + productImageModel.get('image_id'));
                                res.status(201).json(productImageModel);
                            });
                    });
            });
    });
});

module.exports = router;
