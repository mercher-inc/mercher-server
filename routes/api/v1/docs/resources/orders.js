var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        "basePath":       "/",
        "resourcePath":   "/api/v1/order",
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
                "path":       "/api/v1/orders",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "List orders",
                        "type":             "OrdersList",
                        "nickname":         "list",
                        "parameters":       [
                            {
                                "name":        "limit",
                                "description": "Amount of orders to fetch",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            },
                            {
                                "name":        "offset",
                                "description": "Amount of orders to skip",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "OrdersList"
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
                        "summary":          "Create order",
                        "type":             "Order",
                        "nickname":         "create",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "Order object that needs to be created",
                                "required":    true,
                                "type":        "Order",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          201,
                                "message":       "Order was created",
                                "responseModel": "Order"
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
                "path":       "/api/v1/users/{userId}/orders",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "List user's orders",
                        "type":             "OrdersList",
                        "nickname":         "list_users_orders",
                        "parameters":       [
                            {
                                "name":        "userId",
                                "description": "ID of the user which orders needs to be fetched",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            },
                            {
                                "name":        "limit",
                                "description": "Amount of orders to fetch",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            },
                            {
                                "name":        "offset",
                                "description": "Amount of orders to skip",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "OrdersList"
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
                "path":       "/api/v1/shops/{shopId}/orders",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "List shop's orders",
                        "type":             "OrdersList",
                        "nickname":         "list_shops_orders",
                        "parameters":       [
                            {
                                "name":        "shopId",
                                "description": "ID of the shop which orders needs to be fetched",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            },
                            {
                                "name":        "limit",
                                "description": "Amount of orders to fetch",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            },
                            {
                                "name":        "offset",
                                "description": "Amount of orders to skip",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "OrdersList"
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
                "path":       "/api/v1/orders/{orderId}",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "Read order",
                        "type":             "Order",
                        "nickname":         "read",
                        "parameters":       [
                            {
                                "name":        "orderId",
                                "description": "ID of the order that needs to be fetched",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "Order"
                            },
                            {
                                "code":          400,
                                "message":       "Bad request",
                                "responseModel": "RequestError"
                            },
                            {
                                "code":          404,
                                "message":       "Order not found",
                                "responseModel": "NotFoundError"
                            }
                        ]
                    },
                    {
                        "method":           "PUT",
                        "summary":          "Update order",
                        "type":             "Order",
                        "nickname":         "update",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "Order object that needs to be updated",
                                "required":    true,
                                "type":        "Order",
                                "paramType":   "body"
                            },
                            {
                                "name":        "orderId",
                                "description": "ID of the order that needs to be updated",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "Order"
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
                                "message":       "Order not found",
                                "responseModel": "NotFoundError"
                            }
                        ]
                    },
                    {
                        "method":           "DELETE",
                        "summary":          "Delete order",
                        "type":             "void",
                        "nickname":         "delete",
                        "parameters":       [
                            {
                                "name":        "orderId",
                                "description": "ID of the order that needs to be deleted",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":    200,
                                "message": "Order was deleted"
                            },
                            {
                                "code":          400,
                                "message":       "Bad request",
                                "responseModel": "RequestError"
                            },
                            {
                                "code":          404,
                                "message":       "Order not found",
                                "responseModel": "NotFoundError"
                            }
                        ]
                    }
                ]
            }
        ],
        "models":         {
            "Order":             require('../models/order'),
            "OrdersList":        require('../collections/orders'),
            "User":              require('../models/user'),
            "Shop":              require('../models/shop'),
            "Image":             require('../models/image'),
            "RequestError":      require('../errors/request'),
            "UnauthorizedError": require('../errors/unauthorized'),
            "NotFoundError":     require('../errors/not_found'),
            "ValidationError":   require('../errors/validation'),
            "FieldError":        require('../errors/field')
        }
    });
});

module.exports = router;
