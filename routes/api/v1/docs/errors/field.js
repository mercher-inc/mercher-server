module.exports = {
    "id":          "FieldError",
    "required":    [
        "field",
        "errors"
    ],
    "description": "Field validation error",
    "properties":  {
        "field":  {
            "type": "string"
        },
        "errors": {
            "type":  "array",
            "items": {
                "type": "string"
            }
        }
    }
};
