module.exports = {
    "id":          "Image",
    "required":    [
        "id",
        "key",
        "origin",
        "dimensions",
        "crop_geometry",
        "files",
        "is_active",
        "is_banned"
    ],
    "description": "Image model",
    "properties":  {
        "id":            {
            "type":   "integer",
            "format": "int32"
        },
        "title":         {
            "type":         "string",
            "defaultValue": null
        },
        "description":   {
            "type":         "string",
            "defaultValue": null
        },
        "key":           {
            "type": "string"
        },
        "origin":        {
            "type": "string"
        },
        "dimensions":    {
            "type": "json"
        },
        "crop_geometry": {
            "type": "json"
        },
        "files":         {
            "type": "json"
        },
        "is_active":     {
            "type":         "boolean",
            "defaultValue": true
        },
        "is_banned":     {
            "type":         "boolean",
            "defaultValue": false
        },
        "created_at":    {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "updated_at":    {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        }
    }
};
