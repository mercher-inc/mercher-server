module.exports = {
    "id":          "ShopsList",
    "required":    [
        "shops",
        "total"
    ],
    "description": "Shops collection",
    "properties":  {
        "shops": {
            "type":  "array",
            "items": {
                "$ref": "Shop"
            }
        },
        "total": {
            "type":   "integer",
            "format": "int32"
        }
    }
};
