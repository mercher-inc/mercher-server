var PermissionError = function (message) {
    this.name = "PermissionError";
    this.message = message || "Permission error";
};

PermissionError.prototype = new Error();
PermissionError.prototype.constructor = PermissionError;

module.exports = PermissionError;
