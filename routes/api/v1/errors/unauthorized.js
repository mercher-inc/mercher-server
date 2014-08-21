var ApiError = require('./api_error');

var UnauthorizedError = function (message) {
    this.status = 401;
    this.name = "UnauthorizedError";
    this.message = message || "Not Authorized";

    this.error = {
        "error":   this.name,
        "message": this.message
    };
};

UnauthorizedError.prototype = new ApiError();
UnauthorizedError.prototype.constructor = UnauthorizedError;

module.exports = UnauthorizedError;