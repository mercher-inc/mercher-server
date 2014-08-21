module.exports = {
    "id":          "ProductsList",
    "required":    [
        "products",
        "total"
    ],
    "description": "Products collection",
    "properties":  {
        "products": {
            "type":  "array",
            "items": {
                "$ref": "Product"
            }
        },
        "total":    {
            "type":   "integer",
            "format": "int32"
        }
    }
};
