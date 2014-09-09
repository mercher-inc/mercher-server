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
                "path":       "/api/v1/auth/sign_up",
                "operations": [
                    {
                        "method":           "POST",
                        "summary":          "Sign Up",
                        "type":             "AccessToken",
                        "nickname":         "sign_up",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "User Sign Up Credentials model",
                                "required":    true,
                                "type":        "UserSignUpCredentials",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          201,
                                "message":       "User account was created successfully",
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
            },
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
                                "description": "User Auth Credentials model",
                                "required":    true,
                                "type":        "UserAuthCredentials",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          201,
                                "message":       "Access Token was created successfully",
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
            },
            {
                "path":       "/api/v1/auth/facebook",
                "operations": [
                    {
                        "method":           "POST",
                        "summary":          "Facebook authorization",
                        "type":             "AccessToken",
                        "nickname":         "facebook",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "Facebook Auth Credentials model",
                                "required":    true,
                                "type":        "FacebookAuthCredentials",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          201,
                                "message":       "Access Token was created successfully",
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
            "AccessToken":             require('../models/access_token'),
            "UserSignUpCredentials":   require('../models/user_sign_up_credentials'),
            "UserAuthCredentials":     require('../models/user_auth_credentials'),
            "FacebookAuthCredentials": require('../models/facebook_auth_credentials'),
            "ValidationError":         require('../errors/validation'),
            "FieldError":              require('../errors/field')
        }
    });
});

module.exports = router;
