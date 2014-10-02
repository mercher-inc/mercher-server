module.exports = {
    "id":          "OrderRequest",
    "required":    [
        "userId",
        "shopId"
    ],
    "description": "Order request model",
    "properties":  {
        "userId": {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "shopId": {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        }
    }
};
