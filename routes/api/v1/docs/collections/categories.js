module.exports = {
    "id":          "CategoriesList",
    "required":    [
        "categories",
        "total"
    ],
    "description": "Categories collection",
    "properties":  {
        "categories": {
            "type":  "array",
            "items": {
                "$ref": "Category"
            }
        },
        "total": {
            "type":   "integer",
            "format": "int32"
        }
    }
};
