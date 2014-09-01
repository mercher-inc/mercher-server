var InternalServerError = function (message) {
    this.name = "InternalServerError";
    this.message = message || "Internal Server Error";
};

InternalServerError.prototype = new Error();
InternalServerError.prototype.constructor = InternalServerError;

module.exports = InternalServerError;
