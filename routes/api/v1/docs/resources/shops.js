var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        "basePath":       "/",
        "resourcePath":   "/api/v1/shop",
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
                "path":       "/api/v1/shops",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "List shops",
                        "type":             "ShopsList",
                        "nickname":         "list",
                        "parameters":       [
                            {
                                "name":        "limit",
                                "description": "Amount of shops to fetch",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            },
                            {
                                "name":        "offset",
                                "description": "Amount of shops to skip",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "ShopsList"
                            },
                            {
                                "code":          400,
                                "message":       "Bad request",
                                "responseModel": "RequestError"
                            }
                        ]
                    },
                    {
                        "method":           "POST",
                        "summary":          "Create shop",
                        "type":             "Shop",
                        "nickname":         "create",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "Shop object that needs to be created",
                                "required":    true,
                                "type":        "ShopRequest",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          201,
                                "message":       "Shop was created",
                                "responseModel": "Shop"
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
                                "code":          400,
                                "message":       "Bad request",
                                "responseModel": "RequestError"
                            },
                            {
                                "code":          404,
                                "message":       "Shop not found",
                                "responseModel": "NotFoundError"
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
                                "name":        "shopId",
                                "description": "ID of the shop that needs to be updated",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            },
                            {
                                "name":        "body",
                                "description": "Shop object that needs to be updated",
                                "required":    true,
                                "type":        "ShopRequest",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "Shop"
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
                                "message":       "Shop not found",
                                "responseModel": "NotFoundError"
                            }
                        ]
                    }
                ]
            },
            {
                "path":       "/api/v1/users/{userId}/shops",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "List shops for user",
                        "type":             "ShopsList",
                        "nickname":         "list_for_user",
                        "parameters":       [
                            {
                                "name":        "userId",
                                "description": "ID of the user",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            },
                            {
                                "name":        "limit",
                                "description": "Amount of shops to fetch",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            },
                            {
                                "name":        "offset",
                                "description": "Amount of shops to skip",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "ShopsList"
                            },
                            {
                                "code":          400,
                                "message":       "Bad request",
                                "responseModel": "RequestError"
                            }
                        ]
                    }
                ]
            }
        ],
        "models":         {
            "Shop":              require('../models/shop'),
            "ShopRequest":       require('../models/request/shop'),
            "Image":             require('../models/image'),
            "ShopsList":         require('../collections/shops'),
            "RequestError":      require('../errors/request'),
            "UnauthorizedError": require('../errors/unauthorized'),
            "NotFoundError":     require('../errors/not_found'),
            "ValidationError":   require('../errors/validation'),
            "FieldError":        require('../errors/field')
        }
    });
});

module.exports = router;
