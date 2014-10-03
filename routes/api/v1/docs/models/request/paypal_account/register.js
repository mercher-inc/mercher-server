module.exports = {
    "id":          "PayPalAccountRegisterRequest",
    "required":    [
        "requestToken",
        "verificationCode"
    ],
    "description": "PayPal Account register request model",
    "properties":  {
        "requestToken":     {
            "type": "string"
        },
        "verificationCode": {
            "type": "string"
        }
    }
};
