var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        "basePath":       "/",
        "resourcePath":   "/api/v1/product_reviews",
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
                "path":       "/api/v1/product_reviews",
                "operations": [
                    {
                        "method":           "POST",
                        "summary":          "Create product review",
                        "type":             "ProductReview",
                        "nickname":         "create",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "Product Review object that needs to be created",
                                "required":    true,
                                "type":        "ProductReviewCreateRequest",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          201,
                                "message":       "Product Review was created",
                                "responseModel": "ProductReview"
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
                "path":       "/api/v1/product_reviews/{productReviewId}",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "Read product review",
                        "type":             "ProductReview",
                        "nickname":         "read",
                        "parameters":       [
                            {
                                "name":        "productReviewId",
                                "description": "ID of the product review that needs to be fetched",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "ProductReview"
                            },
                            {
                                "code":          400,
                                "message":       "Bad request",
                                "responseModel": "RequestError"
                            },
                            {
                                "code":          404,
                                "message":       "Product not found",
                                "responseModel": "NotFoundError"
                            }
                        ]
                    },
                    {
                        "method":           "PUT",
                        "summary":          "Update product review",
                        "type":             "ProductReview",
                        "nickname":         "update",
                        "parameters":       [
                            {
                                "name":        "productReviewId",
                                "description": "ID of the product review that needs to be updated",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            },
                            {
                                "name":        "body",
                                "description": "Product review object that needs to be updated",
                                "required":    true,
                                "type":        "ProductReviewUpdateRequest",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "ProductReview"
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
                                "message":       "Product not found",
                                "responseModel": "NotFoundError"
                            }
                        ]
                    }
                ]
            },
            {
                "path":       "/api/v1/products/{productId}/product_reviews",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "List product reviews for product",
                        "type":             "ProductReviewsList",
                        "nickname":         "list_for_product",
                        "parameters":       [
                            {
                                "name":        "productId",
                                "description": "ID of the product",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            },
                            {
                                "name":        "limit",
                                "description": "Amount of product reviews to fetch",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            },
                            {
                                "name":        "offset",
                                "description": "Amount of product reviews to skip",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "ProductReviewsList"
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
                "path":       "/api/v1/users/{userId}/product_reviews",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "List product reviews for user",
                        "type":             "ProductReviewsList",
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
                                "description": "Amount of product reviews to fetch",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            },
                            {
                                "name":        "offset",
                                "description": "Amount of product reviews to skip",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "ProductReviewsList"
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
            "ProductReview":              require('../models/product_review'),
            "ProductReviewsList":         require('../collections/product_reviews'),
            "ProductReviewCreateRequest": require('../models/request/product_review/create'),
            "ProductReviewUpdateRequest": require('../models/request/product_review/update'),
            "Product":                    require('../models/product'),
            "User":                       require('../models/user'),
            "RequestError":               require('../errors/request'),
            "UnauthorizedError":          require('../errors/unauthorized'),
            "NotFoundError":              require('../errors/not_found'),
            "ValidationError":            require('../errors/validation'),
            "FieldError":                 require('../errors/field')
        }
    });
});

module.exports = router;