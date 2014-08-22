var express = require('express'),
    crypto = require('crypto'),
    fs = require('fs'),
    router = express.Router(),
    busboy = require('connect-busboy'),
    Promise = require('bluebird'),
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

    var findUnusedName = function (filename) {
        return new Promise(function (resolve) {
            var i = filename.lastIndexOf('.');
            var ext = (i < 0) ? '' : filename.substr(i);

            var hash = crypto.createHash('sha1');
            hash.update(filename, 'utf8');
            hash.update(Math.random().toString(), 'utf8');
            var newFileName = hash.digest('hex') + ext;

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
                var outFS = fs.createWriteStream(__dirname + '/../../../uploads/' + newFileName);
                file.pipe(outFS);
                outFS.on('close', function () {
                    var imageModel = new ImageModel({
                        file: newFileName
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

module.exports = router;
