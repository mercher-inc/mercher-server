module.exports = {
    "id":          "OrderItem",
    "required":    [
        "id",
        "orderId",
        "productId",
        "amount"
    ],
    "description": "Order item model",
    "properties":  {
        "id":           {
            "type":   "integer",
            "format": "int32"
        },
        "orderId":      {
            "type":   "integer",
            "format": "int32"
        },
        "productId":    {
            "type":   "integer",
            "format": "int32"
        },
        "price":        {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "shippingCost": {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "amount":       {
            "type":   "integer",
            "format": "int32"
        },
        "createdAt":    {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "updatedAt":    {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "order":        {
            "$ref":         "Order",
            "defaultValue": null
        },
        "product":      {
            "$ref":         "Product",
            "defaultValue": null
        }
    }
};
