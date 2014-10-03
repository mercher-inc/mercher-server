module.exports = {
    "id":          "UserUpdateRequest",
    "description": "User update request model",
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
        },
        "gender":    {
            "type":         "string",
            "enum":         ["male", "female"],
            "defaultValue": null
        }
    }
};
