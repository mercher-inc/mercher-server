module.exports = {
    "id":          "Craftsman",
    "required":    [
        "id",
        "title",
        "is_active",
        "is_banned"
    ],
    "description": "Craftsman model",
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
        "rating":      {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "is_active":   {
            "type":         "boolean",
            "defaultValue": true
        },
        "is_banned":   {
            "type":         "boolean",
            "defaultValue": false
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
