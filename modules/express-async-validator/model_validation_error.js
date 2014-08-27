(function (module) {

    var ModelValidationError = function (fields, message) {
        this.name = "ModelValidationError";
        this.message = message || "Validation failed";
        this.fields = fields || {};
    };

    ModelValidationError.prototype = new Error();
    ModelValidationError.prototype.constructor = ModelValidationError;

    module.exports = ModelValidationError;

})(module);
