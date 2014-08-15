var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        "apiVersion":     "1.0",
        "swaggerVersion": "1.2",
        "apis":           [
            {
                "path":        "/users",
                "description": "User resource"
            },
            {
                "path":        "/access_tokens",
                "description": "Access token resource"
            },
            {
                "path":        "/shops",
                "description": "Shop resource"
            }
        ],
        "info":           {
            "title":       "Mercher API Documentation",
            "description": "Mercher API Documentation",
            "contact":     "support@mercher.net"
        }
    });
});

router.get('/users', function (req, res) {
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
            "User":      require('./docs/models/user'),
            "Image":     require('./docs/models/image'),
            "UsersList": require('./docs/collections/users')
        }
    });
});

router.get('/access_tokens', function (req, res) {
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
            "User":        require('./docs/models/user'),
            "Image":       require('./docs/models/image'),
            "AccessToken": require('./docs/models/access_token')
        }
    });
});

router.get('/shops', function (req, res) {
    res.json({
        "basePath":     "/",
        "resourcePath": "/api/v1/shop",
        "apiVersion":   "1.0",
        "apis":         [
            {
                "path":       "/api/v1/shops",
                "operations": [
                    {
                        "method":   "GET",
                        "summary":  "List shops",
                        "type":     "ShopsList",
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
                        "summary":          "Create shop",
                        "type":             "Shop",
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
                                "description": "Shop object that needs to be created",
                                "required":    true,
                                "type":        "Shop",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          201,
                                "message":       "Shop was created",
                                "responseModel": "Shop"
                            }
                        ]
                    }
                ]
            },
            {
                "path":       "/api/v1/shops/{shopId}",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "Read shop",
                        "type":             "Shop",
                        "nickname":         "read",
                        "parameters":       [
                            {
                                "name":        "shopId",
                                "description": "ID of the shop that needs to be fetched",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "Shop"
                            },
                            {
                                "code":    400,
                                "message": "Invalid ID supplied"
                            },
                            {
                                "code":    404,
                                "message": "Shop not found"
                            }
                        ]
                    },
                    {
                        "method":           "PUT",
                        "summary":          "Update shop",
                        "type":             "Shop",
                        "nickname":         "update",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "Shop object that needs to be updated",
                                "required":    true,
                                "type":        "Shop",
                                "paramType":   "body"
                            },
                            {
                                "name":        "shopId",
                                "description": "ID of the shop that needs to be updated",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "Shop"
                            },
                            {
                                "code":    400,
                                "message": "Invalid ID supplied"
                            },
                            {
                                "code":    404,
                                "message": "Shop not found"
                            }
                        ]
                    },
                    {
                        "method":           "DELETE",
                        "summary":          "Delete shop",
                        "type":             "void",
                        "nickname":         "delete",
                        "parameters":       [
                            {
                                "name":        "shopId",
                                "description": "ID of the shop that needs to be deleted",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":    200,
                                "message": "Shop was deleted"
                            },
                            {
                                "code":    400,
                                "message": "Invalid ID supplied"
                            },
                            {
                                "code":    404,
                                "message": "Shop not found"
                            }
                        ]
                    }
                ]
            }
        ],
        "models":       {
            "Shop":      require('./docs/models/shop'),
            "Image":     require('./docs/models/image'),
            "ShopsList": require('./docs/collections/shops')
        }
    });
});

module.exports = router;
