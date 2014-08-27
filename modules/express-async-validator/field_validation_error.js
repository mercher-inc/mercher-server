(function (module) {

    var FieldValidationError = function (param, value, message) {
        this.name = "FieldValidationError";
        this.param = param;
        this.value = value;
        this.message = message || "Validation failed";
    };

    FieldValidationError.prototype = new Error();
    FieldValidationError.prototype.constructor = FieldValidationError;

    module.exports = FieldValidationError;

})(module);
