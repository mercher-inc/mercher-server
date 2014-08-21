module.exports = {
    "id":          "RequestError",
    "required":    [
        "error",
        "message",
        "request_errors"
    ],
    "description": "Request error",
    "properties":  {
        "error":          {
            "type": "string"
        },
        "message":        {
            "type": "string"
        },
        "request_errors": {
            "$ref": "FieldError"
        }
    }
};
