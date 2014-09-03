module.exports = {
    "id":          "ImageRequest",
    "required":    [
        "crop_geometry"
    ],
    "description": "Image request model",
    "properties":  {
        "title":         {
            "type":         "string",
            "defaultValue": null
        },
        "description":   {
            "type":         "string",
            "defaultValue": null
        },
        "crop_geometry": {
            "type": "json"
        }
    }
};
