module.exports = {
    "id":          "OrderItemRequest",
    "required":    [
        "order_id",
        "product_id",
        "amount"
    ],
    "description": "Order item request model",
    "properties":  {
        "order_id":      {
            "type":         "integer",
            "format":       "int32"
        },
        "product_id":    {
            "type":         "integer",
            "format":       "int32"
        },
        "amount":        {
            "type":         "integer",
            "format":       "int32"
        }
    }
};
