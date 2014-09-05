module.exports = {
    "id":          "Product",
    "required":    [
        "id",
        "shop_id",
        "title",
        "is_unique",
        "is_public",
        "is_banned",
        "created_at",
        "updated_at"
    ],
    "description": "Product model",
    "properties":  {
        "id":              {
            "type":   "integer",
            "format": "int32"
        },
        "shop_id":         {
            "type":   "integer",
            "format": "int32"
        },
        "category_id":     {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "title":           {
            "type": "string"
        },
        "description":     {
            "type":         "string",
            "defaultValue": null
        },
        "price":           {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "shipping_cost":   {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "shipping_weight": {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "amount_in_stock": {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "is_unique":       {
            "type":         "boolean",
            "defaultValue": false
        },
        "is_public":       {
            "type":         "boolean",
            "defaultValue": true
        },
        "is_banned":       {
            "type":         "boolean",
            "defaultValue": false
        },
        "created_at":      {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "updated_at":      {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "shop":            {
            "$ref": "Shop"
        },
        "category":        {
            "$ref": "Category"
        }
    }
};
