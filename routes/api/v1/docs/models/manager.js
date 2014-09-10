module.exports = {
    "id":          "Manager",
    "required":    [
        "id",
        "userId",
        "shopId",
        "isPublic",
        "isBanned"
    ],
    "description": "Manager model",
    "properties":  {
        "id":        {
            "type":   "integer",
            "format": "int32"
        },
        "userId":    {
            "type":   "integer",
            "format": "int32"
        },
        "shopId":    {
            "type":   "integer",
            "format": "int32"
        },
        "role":      {
            "type": "string",
            "enum": ["editor", "seller", "owner"]
        },
        "isPublic":  {
            "type":         "boolean",
            "defaultValue": true
        },
        "isBanned":  {
            "type":         "boolean",
            "defaultValue": false
        },
        "createdAt": {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "updatedAt": {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "shop":      {
            "$ref": "Shop"
        },
        "user":      {
            "$ref": "User"
        }
    }
};
