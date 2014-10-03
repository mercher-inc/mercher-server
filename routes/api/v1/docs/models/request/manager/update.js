module.exports = {
    "id":          "ManagerUpdateRequest",
    "required":    [
        "shopId",
        "userId",
        "role"
    ],
    "description": "Manager update request model",
    "properties":  {
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
