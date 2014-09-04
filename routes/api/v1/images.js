var express = require('express'),
    crypto = require('crypto'),
    fs = require('fs'),
    router = express.Router(),
    busboy = require('connect-busboy'),
    Promise = require('bluebird'),
    im = require('imagemagick'),
    ImageModel = require('../../../models/image'),
    expressAsyncValidator = require('../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });
    next();
});

router.post('/', busboy());
router.post('/', require('./middleware/auth_check'));

router.post('/', function (req, res) {
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

    req.pipe(req.busboy);
});

router.use('/:imageId', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET'
    });
    next();
});

router.param('imageId', function (req, res, next) {
    req
        .model({
            "imageId": {
                "rules":      {
                    "required":  {
                        "message": "Image ID is required"
                    },
                    "isNumeric": {
                        "message": "Image ID should be numeric"
                    },
                    "toInt":     {}
                },
                "source":     ["params"],
                "allowEmpty": false
            }
        })
        .validate()
        .then(function () {
            var imageModel = new ImageModel({id: req.params.imageId});
            imageModel.fetch({require: true})
                .then(function (model) {
                    req.image = model;
                    next();
                })
                .catch(ImageModel.NotFoundError, function () {
                    var notFoundError = new (require('./errors/not_found'))("Image was not found");
                    next(notFoundError);
                })
                .catch(function (err) {
                    next(err);
                });
        })
        .catch(function (error) {
            var badRequestError = new (require('./errors/bad_request'))("Bad request", error);
            next(badRequestError);
        });
});

router.get('/:imageId', function (req, res) {
    res.json(req.image);
});

router.put('/:imageId', require('./middleware/auth_check'));

router.put('/:imageId', function (req, res, next) {
    req.image
        .save(req.body, {req: req})
        .then(function (imageModel) {
            new ImageModel({id: imageModel.id})
                .fetch()
                .then(function (imageModel) {
                    res.status(200).json(imageModel);
                });
        })
        .catch(ImageModel.PermissionError, function (error) {
            var forbiddenError = new (require('./errors/forbidden'))(error.message);
            next(forbiddenError);
        })
        .catch(ImageModel.ValidationError, function (error) {
            var validationError = new (require('./errors/validation'))("Validation failed", error);
            next(validationError);
        })
        .catch(ImageModel.InternalServerError, function (error) {
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
