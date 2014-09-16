var im = require('imagemagick'),
    Promise = require('bluebird'),
    fs = require('fs'),
    path = require('path'),
    crypto = require('crypto'),
    _ = require('underscore');

module.exports = function (job, done) {

    var cropImage = function (src, dst, geometry) {
        return new Promise(function (resolve, reject) {
            im.convert(
                [
                    src,
                    '-crop', geometry.size + 'x' + geometry.size + '+' + geometry.left + '+' + geometry.top,
                    dst
                ],
                function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(dst)
                });
        });
    };

    var resizeImage = function (src, dst, size) {
        return new Promise(function (resolve, reject) {
            im.convert(
                [
                    src,
                    '-resize', size + 'x' + size,
                    '-strip',
                    '-interlace', 'Plane',
                    '-quality', '85',
                    dst
                ],
                function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(dst)
                });
        });
    };

    var renameImage = function (filepath) {
        return new Promise(function (resolve) {
            var md5sum = crypto.createHash('md5'),
                dir = path.dirname(filepath),
                ext = path.extname(filepath);

            var s = fs.ReadStream(filepath);
            s.on('data', function (d) {
                md5sum.update(d);
            });

            s.on('end', function () {
                var newFilepath = path.join(dir, md5sum.digest('hex') + ext);
                fs.renameSync(filepath, newFilepath);
                resolve(newFilepath);
            });
        });
    };

    var originFile = path.normalize(job.data.originFile),
        originPath = path.dirname(originFile),
        originExt = path.extname(originFile),
        sizeUsages = {},
        resizeParams = [],
        files = {};

    var screens = {
        "mdpi":    1,
        "hdpi":    1.5,
        "xhdpi":   2,
        "xxhdpi":  3,
        "xxxhdpi": 4
    };

    var sizes = {
        "xs": 0,
        "s":  1,
        "m":  2,
        "l":  3,
        "xl": 4
    };

    _.each(screens, function (dpi, resolutionName) {
        _.each(sizes, function (multiplier, sizeName) {
            var size = Math.min(Math.pow(2, multiplier) * 100 * dpi, job.data.cropGeometry.size);
            sizeUsages[size] = sizeUsages[size] || {};
            sizeUsages[size][sizeName] = sizeUsages[size][sizeName] || [];
            sizeUsages[size][sizeName].push(resolutionName);
        });
    });

    _.each(sizeUsages, function (usage, size) {
        resizeParams.push({
            dst:   path.join(originPath, size + originExt),
            size:  size,
            usage: usage
        });
    });

    cropImage(originFile, path.join(originPath, 'tmp' + originExt), job.data.cropGeometry)
        .then(function (croppedFile) {
            return Promise
                .each(resizeParams, function (item, index, count) {
                    return resizeImage(croppedFile, item.dst, item.size)
                        .then(function (resizedFile) {
                            return renameImage(resizedFile)
                                .then(function (resizedFile) {
                                    _.each(item.usage, function (resolutionNames, sizeName) {
                                        files[sizeName] = files[sizeName] || {};
                                        _.each(resolutionNames, function (resolutionName) {
                                            files[sizeName][resolutionName] = {
                                                file: path.basename(resizedFile),
                                                size: item.size
                                            };
                                        });
                                    });
                                    job.progress(index + 1, count);
                                });
                        })
                        .catch(function (err) {
                            done && done(err);
                        });
                })
                .then(function () {
                    fs.unlinkSync(croppedFile);
                    done && done(null, files);
                })
                .catch(function (err) {
                    done && done(err);
                });
        })
        .catch(function (err) {
            done && done(err);
        });
};