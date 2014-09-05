module.exports = {
    "id":          "Manager",
    "required":    [
        "user_id",
        "shop_id"
    ],
    "description": "Manager model",
    "properties":  {
        "user_id":   {
            "type":   "integer",
            "format": "int32"
        },
        "shop_id":   {
            "type":   "integer",
            "format": "int32"
        },
        "role":      {
            "type": "string",
            "enum": ["editor", "seller", "owner"]
        },
        "is_public": {
            "type":         "boolean",
            "defaultValue": true
        }
    }
};
