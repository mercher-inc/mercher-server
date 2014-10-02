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
                "path":       "/api/v1/shops/{shopId}/paypal_accounts/request",
                "operations": [
                    {
                        "method":           "POST",
                        "summary":          "Create PayPal account request",
                        "type":             "ShopPayPalAuthRequest",
                        "nickname":         "create_request",
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
                                "code":          201,
                                "message":       "OK",
                                "responseModel": "ShopPayPalAuthRequest"
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
                "path":       "/api/v1/paypal_accounts/register",
                "operations": [
                    {
                        "method":           "POST",
                        "summary":          "Register an account",
                        "type":             "PayPalAccount",
                        "nickname":         "register",
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
            "ShopPayPalAuthRequest":    require('../models/shop_paypal_auth_request'),
            "Shop":                     require('../models/shop'),
            "PayPalAccountCredentials": require('../models/request/paypal_account_credentials'),
            "ValidationError":          require('../errors/validation'),
            "FieldError":               require('../errors/field')
        }
    });
});

module.exports = router;
