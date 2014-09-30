var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        "basePath":       "/",
        "resourcePath":   "/api/v1/paypal_accounts",
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
                "path":       "/api/v1/shops/{shopId}/paypal_accounts/auth_link",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "Generate auth link",
                        "type":             "PayPalAuthLink",
                        "nickname":         "generate_auth_link",
                        "parameters":       [
                            {
                                "name":        "shopId",
                                "description": "ID of the shop",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "PayPalAuthLink"
                            },
                            {
                                "code":          400,
                                "message":       "Bad request",
                                "responseModel": "RequestError"
                            }
                        ]
                    }
                ]
            },
            {
                "path":       "/api/v1/paypal_accounts",
                "operations": [
                    {
                        "method":           "POST",
                        "summary":          "Create an account",
                        "type":             "PayPalAccount",
                        "nickname":         "sign_up",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "PayPal Account Credentials model",
                                "required":    true,
                                "type":        "PayPalAccountCredentials",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          201,
                                "message":       "PayPal account was created successfully",
                                "responseModel": "PayPalAccount"
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
            "PayPalAccount":            require('../models/paypal_account'),
            "PayPalAccountCredentials": require('../models/request/paypal_account_credentials'),
            "ValidationError":          require('../errors/validation'),
            "FieldError":               require('../errors/field')
        }
    });
});

module.exports = router;
