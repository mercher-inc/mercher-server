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
            "type": "string"
        },
        "message":           {
            "type": "string"
        },
        "validation_errors": {
            "$ref": "FieldError"
        }
    }
};
