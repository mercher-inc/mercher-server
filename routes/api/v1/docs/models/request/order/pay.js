module.exports = {
    "id":          "OrderPayRequest",
    "required":    [
        "returnUrl",
        "cancelUrl"
    ],
    "description": "Order Pay request model",
    "properties":  {
        "returnUrl": {
            "type": "string"
        },
        "cancelUrl": {
            "type": "string"
        }
    }
};
