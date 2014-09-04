var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        "basePath":       "/",
        "resourcePath":   "/api/v1/product",
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
                "path":       "/api/v1/product_images",
                "operations": [
                    {
                        "method":           "POST",
                        "summary":          "Create product image",
                        "type":             "ProductImage",
                        "nickname":         "create",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "Product Image object that needs to be created",
                                "required":    true,
                                "type":        "ProductImageRequest",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          201,
                                "message":       "Product Image was created",
                                "responseModel": "ProductImage"
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
                "path":       "/api/v1/product_images/{productImageId}",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "Read product image",
                        "type":             "ProductImage",
                        "nickname":         "read",
                        "parameters":       [
                            {
                                "name":        "productImageId",
                                "description": "ID of the product image that needs to be fetched",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "ProductImage"
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
                        "summary":          "Update product image",
                        "type":             "ProductImage",
                        "nickname":         "update",
                        "parameters":       [
                            {
                                "name":        "productImageId",
                                "description": "ID of the product image that needs to be updated",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            },
                            {
                                "name":        "body",
                                "description": "Product image object that needs to be updated",
                                "required":    true,
                                "type":        "ProductImageRequest",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "ProductImage"
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
                "path":       "/api/v1/products/{productId}/product_images",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "List product images for product",
                        "type":             "ProductImagesList",
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
                                "description": "Amount of product images to fetch",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            },
                            {
                                "name":        "offset",
                                "description": "Amount of product images to skip",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "ProductImagesList"
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
            "ProductImage":        require('../models/product_image'),
            "ProductImagesList":   require('../collections/product_images'),
            "ProductImageRequest": require('../models/request/product_image'),
            "Product":             require('../models/product'),
            "Image":               require('../models/image'),
            "RequestError":        require('../errors/request'),
            "UnauthorizedError":   require('../errors/unauthorized'),
            "NotFoundError":       require('../errors/not_found'),
            "ValidationError":     require('../errors/validation'),
            "FieldError":          require('../errors/field')
        }
    });
});

module.exports = router;