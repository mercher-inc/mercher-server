var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        "basePath":       "/",
        "resourcePath":   "/api/v1/auth",
        "apiVersion":     "1.0",
        "swaggerVersion": "1.2",
        "consumes":       [
            "application/json"
        ],
        "produces":       [
            "application/json"
        ],
        "apis":           [
            {
                "path":       "/api/v1/auth/basic",
                "operations": [
                    {
                        "method":           "POST",
                        "summary":          "Basic authorization",
                        "type":             "AccessToken",
                        "nickname":         "basic",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "User Auth Credentials object",
                                "required":    true,
                                "type":        "UserCredentials",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "AccessToken"
                            },
                            {
                                "code":          406,
                                "message":       "Validation failed",
                                "responseModel": "ValidationError"
                            }
                        ]
                    }
                ]
            }
        ],
        "models":         {
            "AccessToken":     require('../models/access_token'),
            "UserCredentials": require('../models/user_credentials'),
            "ValidationError": require('../errors/validation'),
            "FieldError":      require('../errors/field')
        }
    });
});

module.exports = router;
