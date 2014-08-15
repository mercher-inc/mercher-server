var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        "basePath":     "/",
        "resourcePath": "/api/v1/user",
        "apiVersion":   "1.0",
        "apis":         [
            {
                "path":       "/api/v1/users",
                "operations": [
                    {
                        "method":   "GET",
                        "summary":  "List users",
                        "type":     "UsersList",
                        "nickname": "list",
                        "consumes": [
                            "application/json"
                        ],
                        "produces": [
                            "application/json"
                        ]
                    },
                    {
                        "method":           "POST",
                        "summary":          "Create user",
                        "type":             "User",
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
                                "description": "User object that needs to be created",
                                "required":    true,
                                "type":        "User",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          201,
                                "message":       "User was created",
                                "responseModel": "User"
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
                                "code":    400,
                                "message": "Invalid ID supplied"
                            },
                            {
                                "code":    404,
                                "message": "User not found"
                            }
                        ]
                    },
                    {
                        "method":           "PUT",
                        "summary":          "Update user",
                        "type":             "User",
                        "nickname":         "update",
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
                                "code":    400,
                                "message": "Invalid ID supplied"
                            },
                            {
                                "code":    404,
                                "message": "User not found"
                            }
                        ]
                    },
                    {
                        "method":           "DELETE",
                        "summary":          "Delete user",
                        "type":             "void",
                        "nickname":         "delete",
                        "parameters":       [
                            {
                                "name":        "userId",
                                "description": "ID of the user that needs to be deleted",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":    200,
                                "message": "User was deleted"
                            },
                            {
                                "code":    400,
                                "message": "Invalid ID supplied"
                            },
                            {
                                "code":    404,
                                "message": "User not found"
                            }
                        ]
                    }
                ]
            }
        ],
        "models":       {
            "User":      require('../models/user'),
            "Image":     require('../models/image'),
            "UsersList": require('../collections/users')
        }
    });
});

module.exports = router;
