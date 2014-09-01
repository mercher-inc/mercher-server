module.exports = {
    "id":          "Shop",
    "required":    [
        "id",
        "title",
        "is_public",
        "is_banned",
        "created_at",
        "updated_at"
    ],
    "description": "Shop model",
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
        "location":    {
            "type":         "string",
            "defaultValue": null
        },
        "tax":         {
            "type":         "number",
            "format":       "float",
            "defaultValue": 0
        },
        "is_public":   {
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
