module.exports = {
    "id":          "PayPalAccountCredentials",
    "required":    [
        "requestToken",
        "verificationCode"
    ],
    "description": "User Auth Credentials model",
    "properties":  {
        "requestToken":     {
            "type": "string"
        },
        "verificationCode": {
            "type": "string"
        }
    }
};
