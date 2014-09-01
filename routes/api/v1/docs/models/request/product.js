module.exports = {
    "id":          "ProductRequest",
    "required":    [
        "shop_id",
        "title"
    ],
    "description": "Product request model",
    "properties":  {
        "shop_id":                     {
            "type":   "integer",
            "format": "int32"
        },
        "category_id":                 {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "title":                       {
            "type": "string"
        },
        "description":                 {
            "type":         "string",
            "defaultValue": null
        },
        "price":                       {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "shipping_cost":               {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "shipping_weight":             {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "amount_in_stock":             {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "is_unique":                   {
            "type":         "boolean",
            "defaultValue": true
        },
        "is_public":                   {
            "type":         "boolean",
            "defaultValue": true
        },
        "is_banned":                   {
            "type":         "boolean",
            "defaultValue": false
        }
    }
};
