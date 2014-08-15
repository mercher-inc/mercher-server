var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        "basePath":     "/",
        "resourcePath": "/api/v1/access_tokens",
        "apiVersion":   "1.0",
        "apis":         [
            {
                "path":       "/api/v1/access_tokens",
                "operations": [
                    {
                        "method":           "POST",
                        "summary":          "Create access token",
                        "type":             "AccessToken",
                        "nickname":         "create",
                        "consumes":         [
                            "application/json"
                        ],
                        "produces":         [
                            "application/json"
                        ],
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "Access token object that needs to be created",
                                "required":    true,
                                "type":        "AccessToken",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          201,
                                "message":       "Access token was created",
                                "responseModel": "AccessToken"
                            }
                        ]
                    }
                ]
            },
            {
                "path":       "/api/v1/access_tokens/{token}",
                "operations": [
                    {
                        "method":           "DELETE",
                        "summary":          "Delete access token",
                        "type":             "void",
                        "nickname":         "delete",
                        "parameters":       [
                            {
                                "name":        "token",
                                "description": "Access token that needs to be deleted",
                                "required":    true,
                                "type":        "string",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":    200,
                                "message": "Access token was deleted"
                            },
                            {
                                "code":    400,
                                "message": "Invalid ID supplied"
                            },
                            {
                                "code":    404,
                                "message": "Access token not found"
                            }
                        ]
                    }
                ]
            }
        ],
        "models":       {
            "User":        require('../models/user'),
            "Image":       require('../models/image'),
            "AccessToken": require('../models/access_token')
        }
    });
});

module.exports = router;
