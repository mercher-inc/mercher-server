module.exports = {
    "id":          "Category",
    "required":    [
        "id",
        "title",
        "isPublic"
    ],
    "description": "Category model",
    "properties":  {
        "id":        {
            "type":   "integer",
            "format": "int32"
        },
        "imageId":   {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "title":     {
            "type": "string"
        },
        "isPublic":  {
            "type":         "boolean",
            "defaultValue": true
        },
        "createdAt": {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "updatedAt": {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "image":     {
            "$ref":         "Image",
            "defaultValue": null
        }
    }
};
