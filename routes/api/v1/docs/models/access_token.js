module.exports = {
    "id":          "AccessToken",
    "required":    [
        "token",
        "expires_at"
    ],
    "description": "Access token model",
    "properties":  {
        "token":      {
            "type": "string"
        },
        "expires_at": {
            "type":   "string",
            "format": "date-time"
        }
    }
};