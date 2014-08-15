var ApiError = function (message) {
    this.status = 400;
    this.name = "ApiError";
    this.message = message || "Bad Request";

    this.error = {
        "error":   this.name,
        "message": this.message
    };
};

ApiError.prototype = new Error();
ApiError.prototype.constructor = ApiError;

module.exports = ApiError;