module.exports = {
    "id":          "ShopRequest",
    "required":    [
        "title"
    ],
    "description": "Shop request model",
    "properties":  {
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
            "defaultValue": false
        }
    }
};
