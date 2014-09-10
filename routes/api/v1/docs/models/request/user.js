module.exports = {
    "id":          "UserRequest",
    "description": "User request model",
    "properties":  {
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
        }
    }
};
