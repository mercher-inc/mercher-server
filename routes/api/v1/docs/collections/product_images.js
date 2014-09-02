module.exports = {
    "id":          "ProductImagesList",
    "required":    [
        "product_images",
        "total"
    ],
    "description": "Product Images collection",
    "properties":  {
        "product_images": {
            "type":  "array",
            "items": {
                "$ref": "ProductImage"
            }
        },
        "total":          {
            "type":   "integer",
            "format": "int32"
        }
    }
};
