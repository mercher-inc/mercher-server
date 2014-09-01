var express = require('express'),
    crypto = require('crypto'),
    fs = require('fs'),
    router = express.Router(),
    busboy = require('connect-busboy'),
    Promise = require('bluebird'),
    im = require('imagemagick'),
    ImageModel = require('../../../models/image');

router.use(function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE'
    });
    next();
});

router.use('/', busboy());
router.use('/', require('./middleware/auth_check'));

router.post('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });

    var findUnusedKey = function (key) {
        return new Promise(function (resolve) {
            var hash = crypto.createHash('sha1');
            if (key) hash.update(key, 'utf8');
            hash.update(Math.random().toString(), 'utf8');
            key = hash.digest('hex');
            var imageModel = new ImageModel();
            imageModel
                .where({
                    key: key
                })
                .fetch({require: true})
                .then(function () {
                    findUnusedKey(key)
                        .then(function (key) {
                            resolve(key);
                        })
                })
                .catch(ImageModel.NotFoundError, function () {
                    resolve(key);
                });
        });
    };

    var convert = function (srcFile, dstFile, cropGeometry, dimensions) {
        dimensions = dimensions || {width: cropGeometry.width, height: cropGeometry.height};
        dimensions.width = Math.min(dimensions.width, cropGeometry.width);
        dimensions.height = Math.min(dimensions.height, cropGeometry.height);
        return new Promise(function (resolve, reject) {
            im.convert(
                [
                    srcFile,
                    '-crop', cropGeometry.width + 'x' + cropGeometry.height + '+' + cropGeometry.left + '+' + cropGeometry.top,
                    '-resize', dimensions.width + 'x' + dimensions.height,
                    dstFile
                ],
                function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({
                        file:   dstFile,
                        width:  dimensions.width,
                        height: dimensions.height
                    });
                });
        });
    };

    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {

        findUnusedKey()
            .then(function (key) {
                var uploadsPath = __dirname + '/../../../uploads';
                if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath);
                var imagePath = fs.realpathSync(uploadsPath) + '/' + key;
                if (fs.existsSync(imagePath)) fs.rmdirSync(imagePath);
                fs.mkdirSync(imagePath);

                var i = filename.lastIndexOf('.');
                var ext = (i < 0) ? '' : filename.substr(i);
                var originFilePath = imagePath + '/origin' + ext;

                var outFS = fs.createWriteStream(originFilePath);
                file.pipe(outFS);
                outFS.on('close', function () {

                    im.identify(originFilePath, function (err, features) {

                        var cropGeometry = {
                            "width":  features.width,
                            "height": features.height,
                            "top":    0,
                            "left":   0
                        };

                        var originalDimensions = {
                            "width":  features.width,
                            "height": features.height
                        };

                        if (originalDimensions.width < originalDimensions.height) {
                            cropGeometry.height = cropGeometry.width = originalDimensions.width;
                            cropGeometry.left = 0;
                            cropGeometry.top = Math.floor((originalDimensions.height - originalDimensions.width) / 2);
                        } else {
                            cropGeometry.width = cropGeometry.height = originalDimensions.height;
                            cropGeometry.top = 0;
                            cropGeometry.left = Math.floor((originalDimensions.width - originalDimensions.height) / 2);
                        }

                        Promise
                            .all([
                                convert(originFilePath, imagePath + '/max' + ext, cropGeometry),
                                convert(originFilePath, imagePath + '/xs' + ext, cropGeometry, {height: 100, width: 100}),
                                convert(originFilePath, imagePath + '/s' + ext, cropGeometry, {height: 200, width: 200}),
                                convert(originFilePath, imagePath + '/m' + ext, cropGeometry, {height: 400, width: 400}),
                                convert(originFilePath, imagePath + '/l' + ext, cropGeometry, {height: 800, width: 800}),
                                convert(originFilePath, imagePath + '/xl' + ext, cropGeometry, {height: 1600, width: 1600}),
                                convert(originFilePath, imagePath + '/xxl' + ext, cropGeometry, {height: 3200, width: 3200})
                            ])
                            .then(function (results) {
                                var files = {
                                    "origin": {
                                        "file":   'origin' + ext,
                                        "width":  originalDimensions.width,
                                        "height": originalDimensions.height
                                    },
                                    "max":    {
                                        "file":   'max' + ext,
                                        "width":  results[0].width,
                                        "height": results[0].height
                                    },
                                    "xs":     {
                                        "file":   'xs' + ext,
                                        "width":  results[1].width,
                                        "height": results[1].height
                                    },
                                    "s":      {
                                        "file":   's' + ext,
                                        "width":  results[2].width,
                                        "height": results[2].height
                                    },
                                    "m":      {
                                        "file":   'm' + ext,
                                        "width":  results[3].width,
                                        "height": results[3].height
                                    },
                                    "l":      {
                                        "file":   'l' + ext,
                                        "width":  results[4].width,
                                        "height": results[4].height
                                    },
                                    "xl":     {
                                        "file":   'xl' + ext,
                                        "width":  results[5].width,
                                        "height": results[5].height
                                    },
                                    "xxl":    {
                                        "file":   'xxl' + ext,
                                        "width":  results[6].width,
                                        "height": results[6].height
                                    }
                                };

                                var imageModel = new ImageModel({
                                    key:           key,
                                    crop_geometry: cropGeometry,
                                    files:         files
                                });
                                imageModel
                                    .save()
                                    .then(function (imageModel) {
                                        new ImageModel({id: imageModel.id})
                                            .fetch()
                                            .then(function (imageModel) {
                                                res.json(imageModel);
                                                req.image = imageModel;
                                                next();
                                            });
                                    });
                            })
                            .catch(function (error) {
                                next(error);
                            });
                    });
                });
            });

    });
});

module.exports = router;
