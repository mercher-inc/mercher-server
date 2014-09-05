module.exports = {
    "id":          "OrderItem",
    "required":    [
        "id",
        "user_id",
        "shop_id",
        "status"
    ],
    "description": "Order model",
    "properties":  {
        "id":            {
            "type":   "integer",
            "format": "int32"
        },
        "order_id":      {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "product_id":    {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
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
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
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
