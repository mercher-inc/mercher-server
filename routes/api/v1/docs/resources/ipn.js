var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        "basePath":       "/",
        "resourcePath":   "/ipn",
        "apiVersion":     "1.0",
        "swaggerVersion": "1.2",
        "consumes":       [
            "application/x-www-form-urlencoded"
        ],
        "apis":           [
            {
                "path":       "/ipn",
                "operations": [
                    {
                        "method":     "POST",
                        "summary":    "IPN endpoint",
                        "nickname":   "ipn",
                        "consumes":   [
                            "application/x-www-form-urlencoded"
                        ],
                        "parameters": [
                            {
                                "name":      "test_ipn",
                                "required":  true,
                                "type":      "boolean",
                                "paramType": "form"
                            },
                            {
                                "name":      "test_ipn",
                                "required":  true,
                                "type":      "boolean",
                                "paramType": "form"
                            },
                        ]
                    }
                ]
            }
        ]
    });
});

module.exports = router;
