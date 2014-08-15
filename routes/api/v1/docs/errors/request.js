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
            "type":   "integer",
            "format": "int32"
        },
        "message":        {
            "type": "string"
        },
        "request_errors": {
            "type":        "array",
            "uniqueItems": true,
            "items":       {
                "$ref": "FieldError"
            }
        }
    }
};
