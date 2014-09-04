module.exports = {
    "id":          "ProductImageRequest",
    "required":    [
        "product_id",
        "image_id"
    ],
    "description": "Product Image request model",
    "properties":  {
        "product_id": {
            "type":   "integer",
            "format": "int32"
        },
        "image_id":   {
            "type":   "integer",
            "format": "int32"
        },
        "priority":   {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": 0
        },
        "is_public":  {
            "type":         "boolean",
            "defaultValue": true
        }
    }
};
