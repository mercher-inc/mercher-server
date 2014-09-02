module.exports = {
    "id":          "ImagesList",
    "required":    [
        "images",
        "total"
    ],
    "description": "Images collection",
    "properties":  {
        "images": {
            "type":  "array",
            "items": {
                "$ref": "Image"
            }
        },
        "total":  {
            "type":   "integer",
            "format": "int32"
        }
    }
};
