module.exports = {
    "id":          "AccessToken",
    "required":    [
        "token",
        "expires"
    ],
    "description": "Access Token model",
    "properties":  {
        "token":   {
            "type": "string"
        },
        "expires": {
            "type":   "string",
            "format": "date-time"
        }
    }
};
