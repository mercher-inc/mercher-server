module.exports = {
    "id":          "ValidationError",
    "required":    [
        "error",
        "message",
        "fields"
    ],
    "description": "Validation error",
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
