var kue = require('kue'),
    queue = kue.createQueue();

queue.process('crop image', function (job, done) {
    var im = require('imagemagick'),
        Promise = require('bluebird'),
        fs = require('fs'),
        path = require('path'),
        crypto = require('crypto');

    var cropImage = function (src, dst, geometry) {
        return new Promise(function (resolve, reject) {
            im.convert(
                [
                    src,
                    '-crop', geometry.width + 'x' + geometry.height + '+' + geometry.left + '+' + geometry.top,
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

    var resizeImage = function (src, dst, dimensions) {
        return new Promise(function (resolve, reject) {
            im.convert(
                [
                    src,
                    '-resize', dimensions.width + 'x' + dimensions.height,
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
        files = {
            xs:  {
                file:       'xs' + originExt,
                dimensions: {
                    height: 100,
                    width:  100
                }
            },
            s:   {
                file:       's' + originExt,
                dimensions: {
                    height: 200,
                    width:  200
                }
            },
            m:   {
                file:       'm' + originExt,
                dimensions: {
                    height: 400,
                    width:  400
                }
            },
            l:   {
                file:       'l' + originExt,
                dimensions: {
                    height: 800,
                    width:  800
                }
            },
            xl:  {
                file:       'xl' + originExt,
                dimensions: {
                    height: 1600,
                    width:  1600
                }
            },
            xxl: {
                file:       'xxl' + originExt,
                dimensions: {
                    height: 3200,
                    width:  3200
                }
            }
        },
        resizeDimensions = [];

    for (var i in files) {
        resizeDimensions.push({
            id:         i,
            dst:        path.join(originPath, files[i].file),
            dimensions: files[i].dimensions
        });
    }

    cropImage(originFile, path.join(originPath, 'max' + originExt), job.data.cropGeometry)
        .then(function (croppedFile) {
            renameImage(croppedFile)
                .then(function (croppedFile) {
                    files["max"] = {
                        "file":     path.basename(croppedFile),
                        dimensions: {
                            height: job.data.cropGeometry.height,
                            width:  job.data.cropGeometry.width
                        }
                    };
                    job.progress(1, resizeDimensions.length + 1);
                    Promise
                        .each(resizeDimensions, function (item, index, count) {
                            return resizeImage(croppedFile, item.dst, item.dimensions)
                                .then(function (resizedFile) {
                                    renameImage(resizedFile)
                                        .then(function (resizedFile) {
                                            files[item.id].file = path.basename(resizedFile);
                                            job.progress(index + 2, count + 1);
                                        });
                                })
                                .catch(function (err) {
                                    done && done(err);
                                });
                        })
                        .then(function () {
                            done && done(null, files);
                        })
                        .catch(function (err) {
                            done && done(err);
                        });
                });
        })
        .catch(function (err) {
            done && done(err);
        });
});

module.exports = queue;