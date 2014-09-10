module.exports = {
    "id":          "ProductImagesList",
    "required":    [
        "productImages",
        "total"
    ],
    "description": "Product Images collection",
    "properties":  {
        "productImages": {
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
