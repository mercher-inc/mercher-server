module.exports = {
    "id":          "ProductImage",
    "required":    [
        "id",
        "productId",
        "imageId",
        "priority",
        "isPublic"
    ],
    "description": "Product Image model",
    "properties":  {
        "id":        {
            "type":   "integer",
            "format": "int32"
        },
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
        "product":   {
            "$ref": "Product"
        },
        "image":     {
            "$ref": "Image"
        }
    }
};
