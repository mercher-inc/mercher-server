module.exports = {
    "id":          "Category",
    "required":    [
        "id",
        "title",
        "is_public"
    ],
    "description": "Category model",
    "properties":  {
        "id":         {
            "type":   "integer",
            "format": "int32"
        },
        "image_id":   {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "title":      {
            "type": "string"
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
        "image":      {
            "$ref":         "Image",
            "defaultValue": null
        }
    }
};
