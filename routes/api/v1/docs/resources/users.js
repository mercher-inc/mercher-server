var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        "basePath":       "/",
        "resourcePath":   "/api/v1/user",
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
                "path":       "/api/v1/users",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "List users",
                        "type":             "UsersList",
                        "nickname":         "list",
                        "parameters":       [
                            {
                                "name":        "limit",
                                "description": "Amount of users to fetch",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            },
                            {
                                "name":        "offset",
                                "description": "Amount of users to skip",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "UsersList"
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
                "path":       "/api/v1/users/{userId}",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "Read user",
                        "type":             "User",
                        "nickname":         "read",
                        "notes":            "\"{userId}\" could have a special value \"me\", which points to current user's profile.",
                        "parameters":       [
                            {
                                "name":        "userId",
                                "description": "ID of the user that needs to be fetched",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "User"
                            },
                            {
                                "code":          400,
                                "message":       "Bad request",
                                "responseModel": "RequestError"
                            },
                            {
                                "code":          404,
                                "message":       "User not found",
                                "responseModel": "NotFoundError"
                            }
                        ]
                    },
                    {
                        "method":           "PUT",
                        "summary":          "Update user",
                        "type":             "User",
                        "nickname":         "update",
                        "notes":            "\"{userId}\" could have a special value \"me\", which points to current user's profile.",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "User object that needs to be updated",
                                "required":    true,
                                "type":        "User",
                                "paramType":   "body"
                            },
                            {
                                "name":        "userId",
                                "description": "ID of the user that needs to be updated",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "User"
                            },
                            {
                                "code":          400,
                                "message":       "Bad request",
                                "responseModel": "RequestError"
                            },
                            {
                                "code":          406,
                                "message":       "Validation failed",
                                "responseModel": "ValidationError"
                            },
                            {
                                "code":          404,
                                "message":       "User not found",
                                "responseModel": "NotFoundError"
                            }
                        ]
                    }
                ]
            }
        ],
        "models":         {
            "User":            require('../models/user'),
            "Image":           require('../models/image'),
            "UsersList":       require('../collections/users'),
            "RequestError":    require('../errors/request'),
            "NotFoundError":   require('../errors/not_found'),
            "ValidationError": require('../errors/validation'),
            "FieldError":      require('../errors/field')
        }
    });
});

module.exports = router;
