module.exports = {
    "id":          "ProductImageCreateRequest",
    "required":    [
        "productId",
        "imageId"
    ],
    "description": "Product Image create request model",
    "properties":  {
        "productId": {
            "type":   "integer",
            "format": "int32"
        },
        "imageId":   {
            "type":   "integer",
            "format": "int32"
        },
        "priority":  {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": 0
        },
        "isPublic":  {
            "type":         "boolean",
            "defaultValue": true
        }
    }
};
