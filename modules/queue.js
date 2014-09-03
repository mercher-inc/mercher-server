var kue = require('kue'),
    queue = kue.createQueue();

queue.process('crop image', function (job, done) {
    console.log('Processing ' + job.id, job.data);

    var Promise = require('bluebird'),
        ImageModel = require('../models/image');

    new ImageModel({id: job.data.imageId})
        .fetch()
        .then(function (imageModel) {

            var getExt = function (path) {
                var i = path.lastIndexOf('.');
                return (i < 0) ? '' : path.substr(i);
            };

            var uploadsPath = ImageModel.getUploadsPath(),
                imagePath = uploadsPath + '/' + imageModel.get('key'),
                originFilePath = imagePath + '/' + imageModel.get('files').origin.file,
                cropGeometry = imageModel.get('crop_geometry'),
                ext = getExt(originFilePath);

            Promise.each(
                [
                    {key: 'max'},
                    {key: 'xs', dimensions: {height: 100, width: 100}},
                    {key: 's', dimensions: {height: 200, width: 200}},
                    {key: 'm', dimensions: {height: 400, width: 400}},
                    {key: 'l', dimensions: {height: 800, width: 800}},
                    {key: 'xl', dimensions: {height: 1600, width: 1600}},
                    {key: 'xxl', dimensions: {height: 3200, width: 3200}}
                ],
                function (item, index, count) {
                    return ImageModel
                        .convert(originFilePath, imagePath + '/' + item.key + ext, cropGeometry, item.dimensions)
                        .then(function (result) {
                            job.progress(index + 1, count);
                            return result;
                        });
                }
            )
                .then(function () {
                    done && done();
                })
                .catch(function (err) {
                    done && done(err);
                });
        });
});

module.exports = queue;