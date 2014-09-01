var _ = require('underscore'),
    ApiError = require('./api_error');

var InternalServerError = function (message) {
    this.status = 500;
    this.name = "InternalServerError";
    this.message = message || "Internal Server Error";

    this.error = {
        "error":   this.name,
        "message": this.message
    };
};

InternalServerError.prototype = new ApiError();
InternalServerError.prototype.constructor = InternalServerError;

module.exports = InternalServerError;
