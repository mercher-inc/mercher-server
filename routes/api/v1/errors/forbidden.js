var _ = require('underscore'),
    ApiError = require('./api_error');

var ForbiddenError = function (message) {
    this.status = 403;
    this.name = "ForbiddenError";
    this.message = message || "Forbidden";

    this.error = {
        "error":   this.name,
        "message": this.message
    };
};

ForbiddenError.prototype = new ApiError();
ForbiddenError.prototype.constructor = ForbiddenError;

module.exports = ForbiddenError;
