module.exports = {
    "id":          "OrdersList",
    "required":    [
        "orders",
        "total"
    ],
    "description": "Orders collection",
    "properties":  {
        "orders": {
            "type":  "array",
            "items": {
                "$ref": "Order"
            }
        },
        "total":  {
            "type":   "integer",
            "format": "int32"
        }
    }
};
