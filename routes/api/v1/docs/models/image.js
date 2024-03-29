module.exports = {
    "id":          "Image",
    "required":    [
        "id",
        "key",
        "origin",
        "dimensions",
        "cropGeometry",
        "files",
        "isActive",
        "isBanned"
    ],
    "description": "Image model",
    "properties":  {
        "id":           {
            "type":   "integer",
            "format": "int32"
        },
        "userId":       {
            "type":   "integer",
            "format": "int32"
        },
        "title":        {
            "type":         "string",
            "defaultValue": null
        },
        "description":  {
            "type":         "string",
            "defaultValue": null
        },
        "key":          {
            "type": "string"
        },
        "origin":       {
            "type": "string"
        },
        "dimensions":   {
            "type": "json"
        },
        "cropGeometry": {
            "type": "json"
        },
        "files":        {
            "type": "json"
        },
        "colors":       {
            "type":  "array",
            "items": {
                "type": "string"
            }
        },
        "mainColor":    {
            "type": "string"
        },
        "colorSchema":  {
            "type": "string",
            "enum": ["light", "dark"]
        },
        "isActive":     {
            "type":         "boolean",
            "defaultValue": true
        },
        "isBanned":     {
            "type":         "boolean",
            "defaultValue": false
        },
        "createdAt":    {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "updatedAt":    {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        }
    }
};
