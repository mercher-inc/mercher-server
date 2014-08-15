module.exports = {
    "id":          "NotFoundError",
    "required":    [
        "error",
        "message"
    ],
    "description": "Not Found error",
    "properties":  {
        "error":   {
            "type":   "integer",
            "format": "int32"
        },
        "message": {
            "type": "string"
        }
    }
};
