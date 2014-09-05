module.exports = {
    "id":          "OrderRequest",
    "required":    [
        "user_id",
        "shop_id",
        "status"
    ],
    "description": "Order request model",
    "properties":  {
        "user_id": {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "shop_id": {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "status":  {
            "type": "string",
            "enum": ["draft", "submitted", "received", "rejected", "completed"]
        }
    }
};
