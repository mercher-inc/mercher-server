var bookshelf = require('../modules/bookshelf'),
    queue = require('../modules/queue');

var ImageModel = bookshelf.Model.extend(
    {
        tableName:     'image',
        hasTimestamps: true,

        initialize: function () {
            this.on('created', this.cropImage);
            this.on('updating', function () {
                if (this.hasChanged('crop_geometry')) {
                    this.cropImage();
                }
            });
        },
        cropImage:  function (imageModel) {
            var path = require('path'),
                params = {
                    originFile:   path.join(ImageModel.getUploadsPath(), imageModel.get('key'), imageModel.get('origin')),
                    cropGeometry: imageModel.get('crop_geometry')
                };

            var job = queue.create('crop image', params).save();

            job.on('complete', function (files) {
                console.log("\rJob #" + job.id + " completed");
                imageModel.save({files: files, is_active: true});
            }).on('failed', function () {
                console.log("\rJob #" + job.id + " failed");
            }).on('progress', function (progress) {
                process.stdout.write('\rJob #' + job.id + ' ' + progress + '% complete');
            });
        }
    },
    {
        createImage:    function (file, filename) {
            var fs = require('fs'),
                path = require('path'),
                crypto = require('crypto'),
                im = require('imagemagick'),
                Promise = require('bluebird');

            return new Promise(function (resolve, reject) {
                ImageModel.findUnusedKey()
                    .then(function (key) {
                        var imageModel = new ImageModel({key: key});

                        var uploadsPath = ImageModel.getUploadsPath(),
                            imagePath = path.join(uploadsPath, key),
                            ext = path.extname(filename),
                            originFilePath = path.join(imagePath, 'origin' + ext);

                        if (fs.existsSync(imagePath)) fs.rmdirSync(imagePath);
                        fs.mkdirSync(imagePath);

                        var outFS = fs.createWriteStream(originFilePath);
                        file.pipe(outFS);

                        var md5sum = crypto.createHash('md5');
                        file.on('data', function (d) {
                            md5sum.update(d);
                        });

                        outFS.on('close', function () {

                            var newOriginFilePath = path.join(imagePath, md5sum.digest('hex') + ext);
                            fs.renameSync(originFilePath, newOriginFilePath);
                            originFilePath = newOriginFilePath;

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
                                        "origin":        path.basename(originFilePath),
                                        "dimensions":    originalDimensions,
                                        "crop_geometry": cropGeometry
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
        }
    }
);

module.exports = ImageModel;
