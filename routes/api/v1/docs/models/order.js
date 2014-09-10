module.exports = {
    "id":          "Order",
    "required":    [
        "id",
        "userId",
        "shopId",
        "status"
    ],
    "description": "Order model",
    "properties":  {
        "id":                {
            "type":   "integer",
            "format": "int32"
        },
        "userId":            {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "shopId":            {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "status":            {
            "type": "string",
            "enum": ["draft", "submitted", "received", "rejected", "completed"]
        },
        "priceTotal":        {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "shippingCostTotal": {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "taxTotal":          {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "createdAt":         {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "updatedAt":         {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "user":              {
            "$ref":         "User",
            "defaultValue": null
        },
        "shop":              {
            "$ref":         "Shop",
            "defaultValue": null
        },
        "orderItems":        {
            "type":  "array",
            "items": {
                "$ref": "OrderItem"
            }
        }
    }
};
