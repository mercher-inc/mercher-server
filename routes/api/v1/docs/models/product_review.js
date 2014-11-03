module.exports = {
    "id":          "ProductReview",
    "required":    [
        "id",
        "productId",
        "userId",
        "rating",
        "comment"
    ],
    "description": "Product Review model",
    "properties":  {
        "id":        {
            "type":   "integer",
            "format": "int32"
        },
        "productId": {
            "type":   "integer",
            "format": "int32"
        },
        "userId":    {
            "type":   "integer",
            "format": "int32"
        },
        "rating":    {
            "type":   "integer",
            "format": "int32"
        },
        "comment":   {
            "type": "string"
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
        "product":   {
            "$ref": "Product"
        },
        "user":      {
            "$ref": "User"
        }
    }
};
