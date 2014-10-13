var express = require('express'),
    crypto = require('crypto'),
    fs = require('fs'),
    router = express.Router(),
    busboy = require('connect-busboy'),
    Promise = require('bluebird'),
    ImageModel = require('../../../models/image'),
    validator = require('../../../modules/express-async-validator/module');

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
                return imageModel.save({userId: req.currentUser.id});
            })
            .then(function (imageModel) {
                res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/images/' + imageModel.id);
                res.status(201).json(imageModel);
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
    var imageModel = new ImageModel({id: parseInt(req.params.imageId)});
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
});

router.get('/:imageId', function (req, res) {
    req.image
        .load('user')
        .then(function (imageModel) {
            res.json(imageModel);
        });
});

router.put('/:imageId', require('./middleware/auth_check'));

router.put('/:imageId', validator(require('./validation/images/update.json'), {source: 'body', param: 'updateForm'}));

router.put('/:imageId', function (req, res, next) {
    req.image
        .save(req['updateForm'])
        .then(function (imageModel) {
            res.status(200).json(imageModel);
        });
});

router.delete('/:imageId', require('./middleware/auth_check'));

router.delete('/:imageId', function (req, res, next) {
    var _ = require('underscore'),
        path = require('path'),
        queue = require('../../../modules/queue'),
        files = [];

    _.each(req.image.get('files'), function (sizeFiles) {
        _.each(sizeFiles, function (resolutionFile) {
            var oldFileName = path.join(ImageModel.getUploadsPath(), req.image.get('key'), resolutionFile.file);
            files.push(oldFileName);
        });
    });
    files = _.uniq(files);
    console.log(files, req.image.get('key'));

    req.image
        .destroy()
        .then(function () {
            _.each(files, function (oldFileName) {
                queue.create('delete file', {fileName: oldFileName}).save();
            });
            res.status(204).send();
        })
        .catch(function (e) {
            console.log(e);
        });
});

module.exports = router;
