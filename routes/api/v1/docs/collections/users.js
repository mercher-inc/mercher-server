module.exports = {
    "id":          "UsersList",
    "required":    [
        "users",
        "total"
    ],
    "description": "Users collection",
    "properties":  {
        "users": {
            "type":  "array",
            "items": {
                "$ref": "User"
            }
        },
        "total": {
            "type":   "integer",
            "format": "int32"
        }
    }
};
