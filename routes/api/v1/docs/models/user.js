module.exports = {
    "id":          "User",
    "required":    [
        "id",
        "email",
        "is_active",
        "is_banned"
    ],
    "description": "User model",
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
        "first_name": {
            "type":         "string",
            "defaultValue": null
        },
        "last_name":  {
            "type":         "string",
            "defaultValue": null
        },
        "email":      {
            "type": "string"
        },
        "password":   {
            "type":         "string",
            "defaultValue": null
        },
        "last_login": {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "is_active":  {
            "type":         "boolean",
            "defaultValue": true
        },
        "is_banned":  {
            "type":         "boolean",
            "defaultValue": false
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
