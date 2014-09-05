module.exports = {
    "id":          "Category",
    "required":    [
        "title"
    ],
    "description": "Category model",
    "properties":  {
        "image_id":  {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "title":     {
            "type": "string"
        },
        "is_public": {
            "type":         "boolean",
            "defaultValue": true
        }
    }
};
