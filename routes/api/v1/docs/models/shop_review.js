module.exports = {
    "id":          "ShopReview",
    "required":    [
        "id",
        "shopId",
        "userId",
        "rating",
        "comment"
    ],
    "description": "Shop Review model",
    "properties":  {
        "id":        {
            "type":   "integer",
            "format": "int32"
        },
        "shopId":    {
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
        "shop":      {
            "$ref": "Shop"
        },
        "user":      {
            "$ref": "User"
        }
    }
};
