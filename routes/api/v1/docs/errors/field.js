module.exports = {
    "id":          "FieldError",
    "required":    [
        "field",
        "message"
    ],
    "description": "Field validation error",
    "properties":  {
        "field":   {
            "type": "string"
        },
        "message": {
            "type": "string"
        }
    }
};
