module.exports = {
    "id":          "UserSignUpCredentials",
    "required":    [
        "email",
        "password"
    ],
    "description": "User Sign Up Credentials model",
    "properties":  {
        "email":     {
            "type": "string"
        },
        "password":  {
            "type": "string"
        },
        "firstName": {
            "type": "string"
        },
        "lastName":  {
            "type": "string"
        }
    }
};
