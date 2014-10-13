var kue = require('kue'),
    queue = kue.createQueue({
        redis: {
            port: process.env['REDIS_PORT']     || '6379',
            host: process.env['REDIS_ENDPOINT'] || 'localhost'
        }
    }),
    cropImageProcess = require('./queue/crop_image'),
    deleteFileProcess = require('./queue/delete_file'),
    sendEmailProcess = require('./queue/send_email');

queue.process('crop image', 1, cropImageProcess);
queue.process('delete file', 10, deleteFileProcess);
queue.process('send email', 10, sendEmailProcess);

module.exports = queue;
