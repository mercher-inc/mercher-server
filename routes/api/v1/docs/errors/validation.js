module.exports = {
    "id":          "ValidationError",
    "required":    [
        "error",
        "message",
        "validation_errors"
    ],
    "description": "Validation error",
    "properties":  {
        "error":             {
            "type":   "integer",
            "format": "int32"
        },
        "message":           {
            "type": "string"
        },
        "validation_errors": {
            "type":        "array",
            "uniqueItems": true,
            "items":       {
                "$ref": "FieldError"
            }
        }
    }
};
