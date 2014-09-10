module.exports = {
    "id":          "ProductRequest",
    "required":    [
        "shopId",
        "title"
    ],
    "description": "Product request model",
    "properties":  {
        "shopId":         {
            "type":   "integer",
            "format": "int32"
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
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "isUnique":       {
            "type":         "boolean",
            "defaultValue": true
        },
        "isPublic":       {
            "type":         "boolean",
            "defaultValue": true
        }
    }
};
