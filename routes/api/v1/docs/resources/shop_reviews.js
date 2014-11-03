var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        "basePath":       "/",
        "resourcePath":   "/api/v1/shop_reviews",
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
                "path":       "/api/v1/shop_reviews",
                "operations": [
                    {
                        "method":           "POST",
                        "summary":          "Create shop review",
                        "type":             "ShopReview",
                        "nickname":         "create",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "Shop Review object that needs to be created",
                                "required":    true,
                                "type":        "ShopReviewCreateRequest",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          201,
                                "message":       "Shop Review was created",
                                "responseModel": "ShopReview"
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
                "path":       "/api/v1/shop_reviews/{shopReviewId}",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "Read shop review",
                        "type":             "ShopReview",
                        "nickname":         "read",
                        "parameters":       [
                            {
                                "name":        "shopReviewId",
                                "description": "ID of the shop review that needs to be fetched",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "ShopReview"
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
                        "summary":          "Update shop review",
                        "type":             "ShopReview",
                        "nickname":         "update",
                        "parameters":       [
                            {
                                "name":        "shopReviewId",
                                "description": "ID of the shop review that needs to be updated",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            },
                            {
                                "name":        "body",
                                "description": "Shop review object that needs to be updated",
                                "required":    true,
                                "type":        "ShopReviewUpdateRequest",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "ShopReview"
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
                "path":       "/api/v1/shops/{shopId}/shop_reviews",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "List shop reviews for shop",
                        "type":             "ShopReviewsList",
                        "nickname":         "list_for_shop",
                        "parameters":       [
                            {
                                "name":        "shopId",
                                "description": "ID of the shop",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            },
                            {
                                "name":        "limit",
                                "description": "Amount of shop reviews to fetch",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            },
                            {
                                "name":        "offset",
                                "description": "Amount of shop reviews to skip",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "ShopReviewsList"
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
                "path":       "/api/v1/users/{userId}/shop_reviews",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "List shop reviews for user",
                        "type":             "ShopReviewsList",
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
                                "description": "Amount of shop reviews to fetch",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            },
                            {
                                "name":        "offset",
                                "description": "Amount of shop reviews to skip",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "ShopReviewsList"
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
            "ShopReview":              require('../models/shop_review'),
            "ShopReviewsList":         require('../collections/shop_reviews'),
            "ShopReviewCreateRequest": require('../models/request/shop_review/create'),
            "ShopReviewUpdateRequest": require('../models/request/shop_review/update'),
            "Shop":                    require('../models/shop'),
            "User":                    require('../models/user'),
            "RequestError":            require('../errors/request'),
            "UnauthorizedError":       require('../errors/unauthorized'),
            "NotFoundError":           require('../errors/not_found'),
            "ValidationError":         require('../errors/validation'),
            "FieldError":              require('../errors/field')
        }
    });
});

module.exports = router;