module.exports = {
    "id":          "ProductImage",
    "required":    [
        "id",
        "product_id",
        "image_id",
        "priority",
        "is_public"
    ],
    "description": "Product Image model",
    "properties":  {
        "id":         {
            "type":   "integer",
            "format": "int32"
        },
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
        "product":    {
            "$ref": "Product"
        },
        "image":      {
            "$ref": "Image"
        }
    }
};
