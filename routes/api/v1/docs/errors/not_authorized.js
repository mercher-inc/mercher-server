module.exports = {
    "id":          "NotAuthorizedError",
    "required":    [
        "error",
        "message"
    ],
    "description": "Not Authorized error",
    "properties":  {
        "error":   {
            "type": "string"
        },
        "message": {
            "type": "string"
        }
    }
};
