var bookshelf = require('../modules/bookshelf');

var ImageModel = bookshelf.Model.extend(
    {
        tableName:     'image',
        hasTimestamps: true,

        initialize: function () {
            this.on('saving', this.cropImage);
        },
        cropImage:  function (imageModel, attrs, options) {
            var Promise = require('bluebird');
            return new Promise(function (resolve, reject) {
                if (imageModel.hasChanged('crop_geometry')) {
                    var uploadsPath = ImageModel.getUploadsPath();
                    var imagePath = uploadsPath + '/' + imageModel.get('key');
                    var originFilePath = imagePath + '/' + imageModel.get('files').origin.file;
                    var cropGeometry = imageModel.get('crop_geometry');

                    var i = originFilePath.lastIndexOf('.');
                    var ext = (i < 0) ? '' : originFilePath.substr(i);

                    Promise
                        .props({
                            'max': ImageModel.convert(originFilePath, imagePath + '/max' + ext, cropGeometry),
                            'xs':  ImageModel.convert(originFilePath, imagePath + '/xs' + ext, cropGeometry, {height: 100, width: 100}),
                            's':   ImageModel.convert(originFilePath, imagePath + '/s' + ext, cropGeometry, {height: 200, width: 200}),
                            'm':   ImageModel.convert(originFilePath, imagePath + '/m' + ext, cropGeometry, {height: 400, width: 400}),
                            'l':   ImageModel.convert(originFilePath, imagePath + '/l' + ext, cropGeometry, {height: 800, width: 800}),
                            'xl':  ImageModel.convert(originFilePath, imagePath + '/xl' + ext, cropGeometry, {height: 1600, width: 1600}),
                            'xxl': ImageModel.convert(originFilePath, imagePath + '/xxl' + ext, cropGeometry, {height: 3200, width: 3200})
                        })
                        .then(function (results) {
                            var files = imageModel.get('files');
                            files.max = {
                                "file":   "max" + ext,
                                "width":  results["max"].width,
                                "height": results["max"].height
                            };
                            files.xs = {
                                "file":   "xs" + ext,
                                "width":  results.xs.width,
                                "height": results.xs.height
                            };
                            files.s = {
                                "file":   "s" + ext,
                                "width":  results.s.width,
                                "height": results.s.height
                            };
                            files.m = {
                                "file":   "m" + ext,
                                "width":  results.m.width,
                                "height": results.m.height
                            };
                            files.l = {
                                "file":   "l" + ext,
                                "width":  results.l.width,
                                "height": results.l.height
                            };
                            files.xl = {
                                "file":   "xl" + ext,
                                "width":  results.xl.width,
                                "height": results.xl.height
                            };
                            files.xxl = {
                                "file":   "xxl" + ext,
                                "width":  results.xxl.width,
                                "height": results.xxl.height
                            };
                            imageModel.set("files", files);
                            resolve(imageModel);
                        })
                        .catch(function (e) {
                            reject(e);
                        });
                }
            });
        }
    },
    {
        createImage:    function (file, filename) {
            var fs = require('fs'),
                im = require('imagemagick'),
                Promise = require('bluebird');

            return new Promise(function (resolve, reject) {
                ImageModel.findUnusedKey()
                    .then(function (key) {
                        var imageModel = new ImageModel({key: key});

                        var uploadsPath = ImageModel.getUploadsPath();
                        var imagePath = uploadsPath + '/' + key;
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

                                imageModel
                                    .save({
                                        "crop_geometry": cropGeometry,
                                        "files":         {
                                            "origin": {
                                                "file":   'origin' + ext,
                                                "width":  originalDimensions.width,
                                                "height": originalDimensions.height
                                            }
                                        }
                                    })
                                    .then(function (imageModel) {
                                        resolve(imageModel);
                                    });
                            });
                        });
                    });
            });
        },
        getUploadsPath: function () {
            var fs = require('fs');

            var uploadsPath = __dirname + '/../uploads';
            if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath);
            return fs.realpathSync(uploadsPath);
        },
        findUnusedKey:  function (key) {
            var Promise = require('bluebird'),
                crypto = require('crypto');

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
                        ImageModel.findUnusedKey(key)
                            .then(function (key) {
                                resolve(key);
                            })
                    })
                    .catch(ImageModel.NotFoundError, function () {
                        resolve(key);
                    });
            });
        },
        convert:        function (srcFile, dstFile, cropGeometry, dimensions) {
            var Promise = require('bluebird'),
                im = require('imagemagick');

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
        }
    }
);

module.exports = ImageModel;
