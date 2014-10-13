var fs = require('fs'),
    path = require('path'),
    _ = require('underscore');

function rmdir(dir) {
    var list = fs.readdirSync(dir);
    _.each(list, function (item) {
        var filename = path.join(dir, item);
        var stat = fs.statSync(filename);
        if (!_.contains([".", ".."], filename)) {
            if (stat.isDirectory()) {
                rmdir(filename);
            } else {
                fs.unlinkSync(filename);
            }
        }
    });
    fs.rmdirSync(dir);
}

module.exports = function (job, done) {
    try {
        rmdir(job.data.dirName);
    } catch (e) {
        done && done(e);
        return;
    }
    done && done();
};
