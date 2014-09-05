module.exports = {
    "id":          "OrderItem",
    "required":    [
        "id",
        "order_id",
        "product_id",
        "amount"
    ],
    "description": "Order item model",
    "properties":  {
        "id":            {
            "type":   "integer",
            "format": "int32"
        },
        "order_id":      {
            "type":   "integer",
            "format": "int32"
        },
        "product_id":    {
            "type":   "integer",
            "format": "int32"
        },
        "price":         {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "shipping_cost": {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "amount":        {
            "type":   "integer",
            "format": "int32"
        },
        "created_at":    {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "updated_at":    {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "order":         {
            "$ref":         "Order",
            "defaultValue": null
        },
        "product":       {
            "$ref":         "Product",
            "defaultValue": null
        }
    }
};
