module.exports = {
    "id":          "Product",
    "required":    [
        "id",
        "title",
        "is_active",
        "is_banned"
    ],
    "description": "Product model",
    "properties":  {
        "id":                          {
            "type":   "integer",
            "format": "int32"
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
        "manufacturer_product_number": {
            "type":         "string",
            "defaultValue": null
        },
        /*"attributes":                  {
         "type":         "json",
         "defaultValue": {}
         },*/
        "tags":                        {
            "type":  "array",
            "items": {
                "type": "string"
            }
        },
        "rating":                      {
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
        "is_active":                   {
            "type":         "boolean",
            "defaultValue": true
        },
        "is_banned":                   {
            "type":         "boolean",
            "defaultValue": false
        },
        "created_at":                  {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "updated_at":                  {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        }
    }
};
