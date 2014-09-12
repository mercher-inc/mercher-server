var express = require('express'),
    router = express.Router(),
    _ = require('underscore'),
    ProductModel = require('../models/product');

router.param('productId', function (req, res, next) {
    var productModel = new ProductModel({id: req.params.productId});
    productModel.fetch({require: true})
        .then(function (model) {
            req.product = model;
            next();
        })
        .catch(function (err) {
            next(err);
        });
});

router.get('/:productId', function (req, res) {
    req.product
        .load(['productImages.image', 'category'])
        .then(function (productModel) {
            req.openGraphObject.og.title = productModel.get('title');
            req.openGraphObject.og.description = productModel.get('description');
            req.openGraphObject.og.type = 'product';
            req.openGraphObject.og.url = 'http://staging.mercherdev.com/products/' + productModel.id;
            req.openGraphObject.product = {};
            req.openGraphObject.product.product_link = 'http://staging.mercherdev.com/products/' + productModel.id;
            if (productModel.get('categoryId')) {
                req.openGraphObject.product.category = productModel.related('category').get('title');
            }
            if (productModel.get('price')) {
                req.openGraphObject.product.price = {
                    amount:   productModel.get('price'),
                    currency: 'USD'
                };
            }
            if (productModel.get('shippingCost')) {
                req.openGraphObject.product.shipping_cost = {
                    amount:   productModel.get('shippingCost'),
                    currency: 'USD'
                };
            }
            if (productModel.related('productImages').length) {
                req.openGraphObject.og.image = [];
                productModel.related('productImages').each(function (productImageModel) {
                    var imageModel = productImageModel.related('image');
                    req.openGraphObject.og.image.push({
                        url:            'http://staging.mercherdev.com/uploads/' + imageModel.get('key') + '/' + imageModel.get('files').l.mdpi.file,
                        width:          imageModel.get('files').l.mdpi.size,
                        height:         imageModel.get('files').l.mdpi.size,
                        user_generated: 'true'
                    });
                });
            }
            res.render('product', {openGraphObject: req.openGraphObject}, function (err, html) {
                console.log(err, html);
                res.status(200).type('html').send(html);
            });
        });
});

module.exports = router;
