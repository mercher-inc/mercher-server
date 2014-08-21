var _ = require('underscore'),
    ApiError = require('./api_error');

var BadRequestError = function (message, error) {
    this.status = 400;
    this.name = "BadRequestError";
    this.message = message || "Bad Request";

    this.error = {
        "error":          this.name,
        "message":        this.message,
        "request_errors": error.fields
    };
};

BadRequestError.prototype = new ApiError();
BadRequestError.prototype.constructor = BadRequestError;

module.exports = BadRequestError;