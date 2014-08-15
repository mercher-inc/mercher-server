var ApiError = require('./api_error');

var NotFoundError = function (message) {
    this.status = 404;
    this.name = "NotFoundError";
    this.message = message || "Not Found";

    this.error = {
        "error":   this.name,
        "message": this.message
    };
};

NotFoundError.prototype = new ApiError();
NotFoundError.prototype.constructor = NotFoundError;

module.exports = NotFoundError;