module.exports = {
    "id":          "Shop",
    "required":    [
        "id",
        "title",
        "isPublic",
        "isBanned",
        "createdAt",
        "updatedAt"
    ],
    "description": "Shop model",
    "properties":  {
        "id":          {
            "type":   "integer",
            "format": "int32"
        },
        "imageId":     {
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
        "isPublic":    {
            "type":         "boolean",
            "defaultValue": true
        },
        "isBanned":    {
            "type":         "boolean",
            "defaultValue": false
        },
        "createdAt":   {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "updatedAt":   {
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
