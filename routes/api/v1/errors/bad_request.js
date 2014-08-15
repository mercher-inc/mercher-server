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
    var requestErrors = {};
    _.each(errors, function (element) {
        requestErrors[element.param] = requestErrors[element.param] || [];
        requestErrors[element.param].push(element.msg);
    });
    _.each(requestErrors, function (element, index) {
        self.error.request_errors.push({
            "field":  index,
            "errors": element
        });
    });
};

BadRequestError.prototype = new ApiError();
BadRequestError.prototype.constructor = BadRequestError;

module.exports = BadRequestError;