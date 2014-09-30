module.exports = {
    "id":          "ShopPayPalAuthRequest",
    "required":    [
        "id",
        "shopId",
        "requestToken",
        "createdAt",
        "updatedAt"
    ],
    "description": "Shop's PayPal Auth request model",
    "properties":  {
        "id":           {
            "type":   "integer",
            "format": "int32"
        },
        "shopId":       {
            "type":   "integer",
            "format": "int32"
        },
        "requestToken": {
            "type": "string"
        },
        "createdAt":    {
            "type":   "string",
            "format": "date-time"
        },
        "updatedAt":    {
            "type":   "string",
            "format": "date-time"
        },
        "shop":         {
            "$ref":         "Shop",
            "defaultValue": null
        }
    }
};
