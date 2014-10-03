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
                "path":       "/api/v1/paypal_accounts/request",
                "operations": [
                    {
                        "method":           "POST",
                        "summary":          "Request an account",
                        "type":             "ShopPayPalAuthRequest",
                        "nickname":         "request",
                        "notes":            "You should use <b>requestToken</b> from response to request user's permissions on PayPal. Redirect user to " +
                                                "<a target='_blank' href=\"https://sandbox.paypal.com/cgi-bin/webscr?cmd=_grant-permission&request_token=requestToken\">" +
                                                "https://sandbox.paypal.com/cgi-bin/webscr?cmd=_grant-permission&request_token=<b>requestToken</b>" +
                            "</a>.",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "PayPal Account request model",
                                "required":    true,
                                "type":        "PayPalAccountRequestRequest",
                                "paramType":   "body"
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
                        "notes":            "Get <b>requestToken</b> and  <b>verificationCode</b> on <b>returnUrl</b> from " +
                            "<a href=\"#!/paypal_accounts/request\">paypal_accounts/request</a> endpoint.",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "PayPal Account Credentials model",
                                "required":    true,
                                "type":        "PayPalAccountRegisterRequest",
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
            "PayPalAccount":                require('../models/paypal_account'),
            "PayPalAccountRequestRequest":  require('../models/request/paypal_account/request'),
            "PayPalAccountRegisterRequest": require('../models/request/paypal_account/register'),
            "ShopPayPalAuthRequest":        require('../models/shop_paypal_auth_request'),
            "Shop":                         require('../models/shop'),
            "ValidationError":              require('../errors/validation'),
            "FieldError":                   require('../errors/field')
        }
    });
});

module.exports = router;
