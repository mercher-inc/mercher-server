module.exports = {
    "id":          "ImageUpdateRequest",
    "required":    [
        "cropGeometry"
    ],
    "description": "Image update request model",
    "properties":  {
        "title":        {
            "type":         "string",
            "defaultValue": null
        },
        "description":  {
            "type":         "string",
            "defaultValue": null
        },
        "cropGeometry": {
            "type": "json"
        },
        "mainColor":    {
            "type": "string"
        },
        "colorSchema":  {
            "type": "string",
            "enum": ["light", "dark"]
        }
    }
};
