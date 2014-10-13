var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base'),
    Promise = require("bluebird"),
    path = require('path'),
    queue = require('../modules/queue'),
    expressAsyncValidator = require('../modules/express-async-validator/module');

var ImageModel = BaseModel.extend(
    {
        tableName: 'image',
        defaults:  {
            userId:        null,
            title:         null,
            description:   null,
            key:           null,
            origin:        null,
            dimensions:    {},
            crop_geometry: {},
            files:         {},
            colors:        [],
            main_color:    null,
            color_schema:  'light',
            isActive:      false,
            isBanned:      false,
            createdAt:     null,
            updatedAt:     null
        },

        user: function () {
            return this.belongsTo(require('./user'));
        },

        initialize: function () {
            this.on('created', this.cropImage);
            this.on('updating', function () {
                if (this.hasChanged('cropGeometry')) {
                    this.cropImage(this);
                }
            });
            this.on('updated', function () {
                io.sockets.emit('image updated', this);
            });
            this.on('destroying', function () {
                if (this.get('key')) {
                    queue.create('remove directory', {dirName: path.join(ImageModel.getUploadsPath(), this.get('key'))}).save();
                }
            });
        },
        cropImage:  function (imageModel) {
            var path = require('path'),
                params = {
                    originFile:   path.join(ImageModel.getUploadsPath(), imageModel.get('key'), imageModel.get('origin')),
                    cropGeometry: imageModel.get('cropGeometry')
                };

            var job = queue.create('crop image', params).save();

            job.on('complete', function (result) {
                var _ = require('underscore'),
                    path = require('path');
                _.each(imageModel.get('files'), function (sizeFiles) {
                    _.each(sizeFiles, function (resolutionFile) {
                        var oldFileName = path.join(ImageModel.getUploadsPath(), imageModel.get('key'), resolutionFile.file);
                        queue.create('delete file', {fileName: oldFileName}).save();
                    });
                });
                imageModel.save({
                    files:       result.files,
                    colors:      result.colors,
                    mainColor:   result.mainColor,
                    colorSchema: result.colorSchema,
                    isActive:    true
                });
            }).on('progress', function (progress) {
                io.sockets.emit('image crop progress changed', {image: imageModel, progress: progress});
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
                                    "size": 0,
                                    "top":  0,
                                    "left": 0
                                };

                                var originalDimensions = {
                                    "width":  features.width,
                                    "height": features.height
                                };

                                if (originalDimensions.width < originalDimensions.height) {
                                    cropGeometry.size = originalDimensions.width;
                                    cropGeometry.left = 0;
                                    cropGeometry.top = Math.floor((originalDimensions.height - originalDimensions.width) / 2);
                                } else {
                                    cropGeometry.size = originalDimensions.height;
                                    cropGeometry.top = 0;
                                    cropGeometry.left = Math.floor((originalDimensions.width - originalDimensions.height) / 2);
                                }

                                imageModel
                                    .save({
                                        "origin":       path.basename(originFilePath),
                                        "dimensions":   originalDimensions,
                                        "cropGeometry": cropGeometry
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
            var fs = require('fs'),
                path = require('path');

            var uploadsPath = path.join(fs.realpathSync(path.join(__dirname, '..')), 'uploads');
            if (!fs.existsSync(uploadsPath)) {
                var externalPath = path.join(fs.realpathSync(process.env.HOME), 'mercher');
                if (!fs.existsSync(externalPath)) {
                    fs.mkdirSync(externalPath);
                }
                externalPath = path.join(externalPath, 'uploads');
                if (!fs.existsSync(externalPath)) {
                    fs.mkdirSync(externalPath);
                }
                fs.symlinkSync(externalPath, uploadsPath);
            }
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
