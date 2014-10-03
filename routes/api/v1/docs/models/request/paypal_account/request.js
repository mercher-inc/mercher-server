module.exports = {
    "id":          "PayPalAccountRequestRequest",
    "required":    [
        "shopId",
        "returnUrl"
    ],
    "description": "PayPal Account request request model",
    "properties":  {
        "shopId":    {
            "type":   "integer",
            "format": "int32"
        },
        "returnUrl": {
            "type": "string"
        }
    }
};
