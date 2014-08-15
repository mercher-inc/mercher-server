var _ = require('underscore'),
    ApiError = require('./api_error');

var ValidationError = function (message, errors) {
    this.status = 406;
    this.name = "ValidationError";
    this.message = message || "Not Acceptable";

    this.error = {
        "error":             this.name,
        "message":           this.message,
        "validation_errors": []
    };
    var self = this;
    var validationErrors = {};
    _.each(errors, function (element) {
        validationErrors[element.param] = validationErrors[element.param] || [];
        validationErrors[element.param].push(element.msg);
    });
    _.each(validationErrors, function (element, index) {
        self.error.validation_errors.push({
            "field":  index,
            "errors": element
        });
    });
};

ValidationError.prototype = new ApiError();
ValidationError.prototype.constructor = ValidationError;

module.exports = ValidationError;