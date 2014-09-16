var fs = require('fs');

module.exports = function (job, done) {
    fs.exists(job.data.fileName, function (exists) {
        if (!exists) {
            done && done();
        } else {
            try {
                fs.unlink(job.data.fileName, function () {
                    done && done();
                });
            } catch (e) {
                done && done(e);
            }
        }
    });
};