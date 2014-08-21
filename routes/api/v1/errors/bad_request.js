var _ = require('underscore'),
    ApiError = require('./api_error');

var BadRequestError = function (message, errors) {
    this.status = 400;
    this.name = "BadRequestError";
    this.message = message || "Bad Request";

    this.error = {
        "error":          this.name,
        "message":        this.message,
        "request_errors": []
    };
    var self = this;
    var requestErrors = error.fields;
    _.each(requestErrors, function (errors, field) {
        self.error.request_errors.push({
            "field":  field,
            "errors": errors
        });
    });
};

BadRequestError.prototype = new ApiError();
BadRequestError.prototype.constructor = BadRequestError;

module.exports = BadRequestError;