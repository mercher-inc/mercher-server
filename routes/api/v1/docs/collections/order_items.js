module.exports = {
    "id":          "OrderItemsList",
    "required":    [
        "order_items",
        "total"
    ],
    "description": "Order items collection",
    "properties":  {
        "order_items": {
            "type":  "array",
            "items": {
                "$ref": "OrderItem"
            }
        },
        "total":       {
            "type":   "integer",
            "format": "int32"
        }
    }
};
