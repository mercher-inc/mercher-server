module.exports = {
    "id":          "Manager",
    "required":    [
        "userId",
        "shopId"
    ],
    "description": "Manager model",
    "properties":  {
        "userId":   {
            "type":   "integer",
            "format": "int32"
        },
        "shopId":   {
            "type":   "integer",
            "format": "int32"
        },
        "role":     {
            "type": "string",
            "enum": ["editor", "seller", "owner"]
        },
        "isPublic": {
            "type":         "boolean",
            "defaultValue": true
        }
    }
};
