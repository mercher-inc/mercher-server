module.exports = {
    "id":          "OrderRequest",
    "required":    [
        "userId",
        "shopId",
        "status"
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
        },
        "status": {
            "type": "string",
            "enum": ["draft", "submitted", "received", "rejected", "completed"]
        }
    }
};
