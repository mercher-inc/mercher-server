module.exports = {
    "id":          "UserSignUpCredentials",
    "required":    [
        "email",
        "password",
        "password_c"
    ],
    "description": "User Sign Up Credentials model",
    "properties":  {
        "email":      {
            "type": "string"
        },
        "password":   {
            "type": "string"
        },
        "password_c": {
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
