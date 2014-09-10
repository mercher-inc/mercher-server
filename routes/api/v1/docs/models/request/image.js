module.exports = {
    "id":          "ImageRequest",
    "required":    [
        "cropGeometry"
    ],
    "description": "Image request model",
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
        }
    }
};
