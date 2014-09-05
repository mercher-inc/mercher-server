module.exports = {
    "id":          "Manager",
    "required":    [
        "id",
        "user_id",
        "shop_id",
        "is_public",
        "is_banned"
    ],
    "description": "Manager model",
    "properties":  {
        "id":         {
            "type":   "integer",
            "format": "int32"
        },
        "user_id":    {
            "type":   "integer",
            "format": "int32"
        },
        "shop_id":    {
            "type":   "integer",
            "format": "int32"
        },
        "role":       {
            "type": "string",
            "enum": ["editor", "seller", "owner"]
        },
        "is_public":  {
            "type":         "boolean",
            "defaultValue": true
        },
        "is_banned":  {
            "type":         "boolean",
            "defaultValue": false
        },
        "created_at": {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "updated_at": {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "shop":       {
            "$ref": "Shop"
        },
        "user":       {
            "$ref": "User"
        }
    }
};
