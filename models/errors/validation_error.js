var ValidationError = function (message, fields) {
    this.name = "ValidationError";
    this.message = message || "Validation error";
    this.fields = fields;
};

ValidationError.prototype = new Error();
ValidationError.prototype.constructor = ValidationError;

module.exports = ValidationError;
