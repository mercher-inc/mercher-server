module.exports = {
    "id":          "UserSignUpCredentials",
    "required":    [
        "email",
        "password"
    ],
    "description": "User Sign Up Credentials model",
    "properties":  {
        "email":      {
            "type": "string"
        },
        "password":   {
            "type": "string"
        },
        "first_name": {
            "type": "string"
        },
        "last_name":  {
            "type": "string"
        }
    }
};
