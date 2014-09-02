var express = require('express'),
    crypto = require('crypto'),
    fs = require('fs'),
    router = express.Router(),
    busboy = require('connect-busboy'),
    Promise = require('bluebird'),
    im = require('imagemagick'),
    ImageModel = require('../../../models/image'),
    expressAsyncValidator = require('../../../modules/express-async-validator/module');

router.use(function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE'
    });
    next();
});

router.use('/', busboy());
router.use('/', require('./middleware/auth_check'));

router.get('/', function (req, res, next) {
    new (expressAsyncValidator.model)({
        "limit":  {
            "rules":        {
                "isInt": {
                    "message": "Limit should be integer"
                },
                "toInt": {}
            },
            "allowEmpty":   true,
            "defaultValue": 10
        },
        "offset": {
            "rules":        {
                "isInt": {
                    "message": "Offset should be integer"
                },
                "toInt": {}
            },
            "allowEmpty":   true,
            "defaultValue": 0
        }
    })
        .validate(req.query)
        .then(function (params) {
            var ImagesCollection = require('../../../collections/images'),
                imagesCollection = new ImagesCollection(),
                imageModel = new ImageModel();

            var totalQuery = imageModel.query();

            if (req.product) {
                totalQuery = totalQuery
                    .join('product_image', 'image.id', 'product_image.image_id')
                    .where('product_image.product_id', '=', req.product.id)
                    .where('product_image.is_public', '=', true)
            }

            Promise
                .props({
                    images: imagesCollection
                                .query(function (qb) {
                                    if (req.product) {
                                        qb
                                            .join('product_image', 'image.id', 'product_image.image_id')
                                            .where('product_image.product_id', '=', req.product.id)
                                            .where('product_image.is_public', '=', true)
                                            .orderByRaw('product_image.priority')
                                    }
                                    qb.limit(params.limit).offset(params.offset);
                                })
                                .fetch(),
                    total:  totalQuery
                                .count('image.id')
                                .then(function (result) {
                                    return parseInt(result[0].count);
                                })
                })
                .then(function (results) {
                    console.log(results);
                    res.json(results);
                })
                .catch(function (err) {
                    console.log(err);
                    next(err);
                });
        })
        .catch(function (error) {
            var badRequestError = new (require('./errors/bad_request'))("Bad request", error);
            next(badRequestError);
        });
});

router.post('/', function (req, res) {

    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {

        ImageModel
            .createImage(file, filename)
            .then(function (imageModel) {
                new ImageModel({id: imageModel.id})
                    .fetch()
                    .then(function (imageModel) {
                        res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/images/' + imageModel.id);
                        res.status(201).json(imageModel);
                    });
            });
    });
});

module.exports = router;
