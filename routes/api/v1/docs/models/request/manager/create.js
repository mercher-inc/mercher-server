module.exports = {
    "id":          "ManagerCreateRequest",
    "required":    [
        "shopId",
        "userId",
        "role"
    ],
    "description": "Manager create request model",
    "properties":  {
        "shopId":   {
            "type":   "integer",
            "format": "int32"
        },
        "userId":   {
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
