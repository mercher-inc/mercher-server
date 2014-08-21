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
                "path":       "/api/v1/products",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "List products",
                        "type":             "ProductsList",
                        "nickname":         "list",
                        "parameters":       [
                            {
                                "name":        "limit",
                                "description": "Amount of products to fetch",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            },
                            {
                                "name":        "offset",
                                "description": "Amount of products to skip",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "ProductsList"
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
                        "summary":          "Create product",
                        "type":             "Product",
                        "nickname":         "create",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "Product object that needs to be created",
                                "required":    true,
                                "type":        "Product",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          201,
                                "message":       "Product was created",
                                "responseModel": "Product"
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
                "path":       "/api/v1/products/{productId}",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "Read product",
                        "type":             "Product",
                        "nickname":         "read",
                        "parameters":       [
                            {
                                "name":        "productId",
                                "description": "ID of the product that needs to be fetched",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "Product"
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
                        "summary":          "Update product",
                        "type":             "Product",
                        "nickname":         "update",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "Product object that needs to be updated",
                                "required":    true,
                                "type":        "Product",
                                "paramType":   "body"
                            },
                            {
                                "name":        "productId",
                                "description": "ID of the product that needs to be updated",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "Product"
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
                    },
                    {
                        "method":           "DELETE",
                        "summary":          "Delete product",
                        "type":             "void",
                        "nickname":         "delete",
                        "parameters":       [
                            {
                                "name":        "productId",
                                "description": "ID of the product that needs to be deleted",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":    200,
                                "message": "Product was deleted"
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
                    }
                ]
            }
        ],
        "models":         {
            "Product":           require('../models/product'),
            "Image":             require('../models/image'),
            "Shop":              require('../models/shop'),
            "Category":          require('../models/category'),
            "ProductsList":      require('../collections/products'),
            "RequestError":      require('../errors/request'),
            "UnauthorizedError": require('../errors/unauthorized'),
            "NotFoundError":     require('../errors/not_found'),
            "ValidationError":   require('../errors/validation'),
            "FieldError":        require('../errors/field')
        }
    });
});

module.exports = router;
