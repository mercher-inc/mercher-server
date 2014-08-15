module.exports = {
    "id":          "UserCredentials",
    "required":    [
        "email",
        "password"
    ],
    "description": "User Auth Credentials model",
    "properties":  {
        "email":    {
            "type": "string"
        },
        "password": {
            "type": "string"
        }
    }
};
