module.exports = {
    "id":          "Category",
    "required":    [
        "id",
        "title",
        "is_active"
    ],
    "description": "Category model",
    "properties":  {
        "id":          {
            "type":   "integer",
            "format": "int32"
        },
        "image_id":    {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "title":       {
            "type": "string"
        },
        "description": {
            "type":         "string",
            "defaultValue": null
        },
        "is_active":   {
            "type":         "boolean",
            "defaultValue": true
        },
        "created_at":  {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "updated_at":  {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "image":       {
            "$ref":         "Image",
            "defaultValue": null
        }
    }
};
