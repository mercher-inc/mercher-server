module.exports = {
    "id":          "User",
    "required":    [
        "id",
        "isBanned"
    ],
    "description": "User model",
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
        "firstName": {
            "type":         "string",
            "defaultValue": null
        },
        "lastName":  {
            "type":         "string",
            "defaultValue": null
        },
        "lastLogin": {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "isBanned":  {
            "type":         "boolean",
            "defaultValue": false
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
