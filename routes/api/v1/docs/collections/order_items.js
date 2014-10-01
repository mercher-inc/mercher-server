module.exports = {
    "id":          "OrderItemsList",
    "required":    [
        "orderItems",
        "total"
    ],
    "description": "Order items collection",
    "properties":  {
        "orderItems": {
            "type":  "array",
            "items": {
                "$ref": "OrderItem"
            }
        },
        "total":      {
            "type":   "integer",
            "format": "int32"
        }
    }
};
