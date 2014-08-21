var ApiError = require('./api_error');

var NotAuthorizedError = function (message) {
    this.status = 401;
    this.name = "NotAuthorizedError";
    this.message = message || "Not Authorized";

    this.error = {
        "error":   this.name,
        "message": this.message
    };
};

NotAuthorizedError.prototype = new ApiError();
NotAuthorizedError.prototype.constructor = NotAuthorizedError;

module.exports = NotAuthorizedError;