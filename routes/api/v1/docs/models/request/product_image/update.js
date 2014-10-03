module.exports = {
    "id":          "ProductImageUpdateRequest",
    "required":    [],
    "description": "Product Image update request model",
    "properties":  {
        "priority": {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": 0
        },
        "isPublic": {
            "type":         "boolean",
            "defaultValue": true
        }
    }
};
