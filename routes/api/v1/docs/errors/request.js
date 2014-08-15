module.exports = {
    "id":          "RequestError",
    "required":    [
        "error",
        "message",
        "fields"
    ],
    "description": "Request error",
    "properties":  {
        "error":   {
            "type":   "integer",
            "format": "int32"
        },
        "message": {
            "type": "string"
        },
        "fields":  {
            "type":        "array",
            "uniqueItems": true,
            "items":       {
                "$ref": "FieldError"
            }
        }
    }
};
