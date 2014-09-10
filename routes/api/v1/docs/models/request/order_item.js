module.exports = {
    "id":          "OrderItemRequest",
    "required":    [
        "orderId",
        "productId",
        "amount"
    ],
    "description": "Order item request model",
    "properties":  {
        "orderId":   {
            "type":   "integer",
            "format": "int32"
        },
        "productId": {
            "type":   "integer",
            "format": "int32"
        },
        "amount":    {
            "type":   "integer",
            "format": "int32"
        }
    }
};
