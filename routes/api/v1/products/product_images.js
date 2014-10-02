var express = require('express'),
    router = express.Router(),
    Promise = require("bluebird"),
    bookshelf = require('../../../../modules/bookshelf'),
    ImageModel = require('../../../../models/image'),
    ProductImagesCollection = require('../../../../collections/product_images'),
    ProductImageModel = require('../../../../models/product_image'),
    validator = require('../../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET'
    });
    next();
});

router.get('/', validator(require('../validation/collection.json'), {source: 'query', param: 'collectionForm'}));

router.get('/', function (req, res, next) {
    var productImagesCollection = new ProductImagesCollection();
    var productImageModel = new ProductImageModel();

    var collectionRequest = productImagesCollection
        .query(function (qb) {
            qb
                .where('product_id', '=', req.product.id)
                .limit(req['collectionForm'].limit)
                .offset(req['collectionForm'].offset);
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
            productImages: collectionRequest,
            total:         totalRequest
        })
        .then(function (results) {
            res.json(results);
        })
        .catch(function (err) {
            next(err);
        });
});

module.exports = router;
