var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    bookshelf = require('../../../../modules/bookshelf'),
    busboy = require('connect-busboy'),
    ImageModel = require('../../../../models/image'),
    ProductImagesCollection = require('../../../../collections/product_images'),
    ProductImageModel = require('../../../../models/product_image');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST'
    });
    next();
});

router.get('/', require('../middleware/collection_params_check'));

router.get('/', function (req, res, next) {
    var productImagesCollection = new ProductImagesCollection();
    var productImageModel = new ProductImageModel();

    var collectionRequest = productImagesCollection
        .query(function (qb) {
            qb
                .where('product_id', '=', req.product.id)
                .limit(req.query.limit)
                .offset(req.query.offset);
        })
        .fetch({
            withRelated: ['image']
        });

    var totalRequest = bookshelf
        .knex(productImageModel.tableName)
        .where('product_id', '=', req.product.id)
        .count(productImageModel.idAttribute)
        .then(function (result) {
            return parseInt(result[0].count);
        });

    Promise
        .props({
            product_images: collectionRequest,
            total:          totalRequest
        })
        .then(function (results) {
            res.json(results);
        })
        .catch(function (err) {
            next(err);
        });
});

router.post('/', busboy());

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
