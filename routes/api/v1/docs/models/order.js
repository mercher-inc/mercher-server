module.exports = {
    "id":          "Order",
    "required":    [
        "id",
        "status",
        "is_active",
        "is_banned"
    ],
    "description": "Order model",
    "properties":  {
        "id":                  {
            "type":   "integer",
            "format": "int32"
        },
        "user_id":             {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "shop_id":             {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "status":              {
            "type": "string",
            "enum": ["new", "open"]
        },
        "price_total":         {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "shipping_cost_total": {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "tax_total":           {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "created_at":          {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "updated_at":          {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "user":                {
            "$ref":         "User",
            "defaultValue": null
        },
        "shop":                {
            "$ref":         "Shop",
            "defaultValue": null
        }
    }
};
