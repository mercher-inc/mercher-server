module.exports = {
    "id":          "Category",
    "required":    [
        "title"
    ],
    "description": "Category model",
    "properties":  {
        "imageId":  {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "title":    {
            "type": "string"
        },
        "isPublic": {
            "type":         "boolean",
            "defaultValue": true
        }
    }
};
