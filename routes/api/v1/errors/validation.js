var _ = require('underscore'),
    ApiError = require('./api_error');

var ValidationError = function (message, error) {
    this.status = 406;
    this.name = "ValidationError";
    this.message = message || "Not Acceptable";

    this.error = {
        "error":             this.name,
        "message":           this.message,
        "validation_errors": []
    };
    var self = this;
    var validationErrors = error.fields;
    _.each(validationErrors, function (errors, field) {
        self.error.validation_errors.push({
            "field":  field,
            "errors": errors
        });
    });
};

ValidationError.prototype = new ApiError();
ValidationError.prototype.constructor = ValidationError;

module.exports = ValidationError;