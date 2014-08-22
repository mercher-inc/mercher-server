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

router.post('/', function (req, res) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });

    var findUnusedName = function (filename) {
        return new Promise(function (resolve) {
            var i = filename.lastIndexOf('.');
            var ext = (i < 0) ? '' : filename.substr(i);

            var hash = crypto.createHash('sha1');
            hash.update(filename, 'utf8');
            hash.update(Math.random().toString(), 'utf8');
            var newFileName = hash.digest('hex') + ext.toLowerCase();

            var imageModel = new ImageModel();

            imageModel
                .where({
                    file: newFileName
                })
                .fetch({require: true})
                .then(function () {
                    findUnusedName(newFileName)
                        .then(function (newFileName) {
                            resolve(newFileName);
                        })
                })
                .catch(ImageModel.NotFoundError, function () {
                    resolve(newFileName);
                });
        });
    };

    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {

        findUnusedName(filename)
            .then(function (newFileName) {
                var uploadsPath = __dirname + '/../../../uploads';
                if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath);
                var newFilePath = fs.realpathSync(uploadsPath) + '/' + newFileName;
                var outFS = fs.createWriteStream(newFilePath);
                file.pipe(outFS);
                outFS.on('close', function () {

                    im.identify(newFilePath, function (err, features) {

                        var cropGeometry = {
                            "width":  0,
                            "height": 0,
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

                        /*var conversions = {
                         'xs': 200,
                         's':  400,
                         'm':  800,
                         'l':  1600,
                         'xl': 3200
                         };*/

                        var squareFilePath = fs.realpathSync(uploadsPath) + '/sq_' + newFileName;
                        var xlFilePath = fs.realpathSync(uploadsPath) + '/xl_' + newFileName;
                        var lFilePath = fs.realpathSync(uploadsPath) + '/l_' + newFileName;

                        im.convert(
                            [
                                newFilePath,
                                '-crop', cropGeometry.width + 'x' + cropGeometry.height + '+' + cropGeometry.left + '+' + cropGeometry.top,
                                squareFilePath
                            ],
                            function (err) {
                                if (err) throw err;
                            });

                        im.convert(
                            [
                                newFilePath,
                                '-crop', cropGeometry.width + 'x' + cropGeometry.height + '+' + cropGeometry.left + '+' + cropGeometry.top,
                                '-resize', '800x800',
                                xlFilePath
                            ],
                            function (err) {
                                if (err) throw err;
                            });

                        im.convert(
                            [
                                newFilePath,
                                '-crop', cropGeometry.width + 'x' + cropGeometry.height + '+' + cropGeometry.left + '+' + cropGeometry.top,
                                '-resize', '400x400',
                                lFilePath
                            ],
                            function (err) {
                                if (err) throw err;
                            });

                        var imageModel = new ImageModel({
                            file:          newFileName,
                            crop_geometry: cropGeometry
                        });
                        imageModel
                            .save()
                            .then(function (imageModel) {
                                imageModel
                                    .fetch()
                                    .then(function (imageModel) {
                                        res.json(imageModel);
                                    });
                            });
                    });
                });
            });

    });
});

module.exports = router;
