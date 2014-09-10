module.exports = {
    "id":          "Product",
    "required":    [
        "id",
        "shopId",
        "title",
        "isUnique",
        "isPublic",
        "isBanned",
        "createdAt",
        "updatedAt"
    ],
    "description": "Product model",
    "properties":  {
        "id":             {
            "type":   "integer",
            "format": "int32"
        },
        "shopId":         {
            "type":   "integer",
            "format": "int32"
        },
        "categoryId":     {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "title":          {
            "type": "string"
        },
        "description":    {
            "type":         "string",
            "defaultValue": null
        },
        "price":          {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "shippingCost":   {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "shippingWeight": {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "amountInStock":  {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "isUnique":       {
            "type":         "boolean",
            "defaultValue": false
        },
        "isPublic":       {
            "type":         "boolean",
            "defaultValue": true
        },
        "isBanned":       {
            "type":         "boolean",
            "defaultValue": false
        },
        "createdAt":      {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "updatedAt":      {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "shop":           {
            "$ref": "Shop"
        },
        "category":       {
            "$ref": "Category"
        }
    }
};
