var app = require('../../../app'),
    Bookshelf = app.get('bookshelf'),
    express = require('express'),
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
    var fs = require('fs'),
        path = require('path'),
        _ = require('underscore'),
        imageDir = path.join(ImageModel.getUploadsPath(), req.image.get('key'));

    function rmdir(dir){
        return new Promise(function (resolve, reject) {
            try {
                var list = fs.readdirSync(dir);
                _.each(list, function(item){
                    var filename = path.join(dir, item);
                    var stat = fs.statSync(filename);
                    if (!_.contains([".", ".."], filename)) {
                        if (stat.isDirectory()) {
                            rmdir(filename);
                        } else {
                            fs.unlinkSync(filename);
                        }
                    }
                });
                fs.rmdirSync(dir);
            } catch (e) {
                reject(e);
                return;
            }
            resolve();
        });
    }

    Bookshelf
        .transaction(function (trx) {
            req.image
                .destroy({transacting: trx})
                .then(function () {
                    return rmdir(imageDir);
                })
                .then(trx.commit)
                .catch(trx.rollback);
        })
        .then(function () {
            console.log('commit');
            res.status(204).send();
        })
        .catch(function () {
            console.log('rollback');
            res.status(500).send();
        });

});

module.exports = router;
