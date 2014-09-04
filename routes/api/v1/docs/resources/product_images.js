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
                "path":       "/api/v1/products/{productId}/product_images",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "List product's images",
                        "type":             "ProductImagesList",
                        "nickname":         "product_images_list",
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
                                "description": "Amount of images to fetch",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            },
                            {
                                "name":        "offset",
                                "description": "Amount of images to skip",
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
                    },
                    {
                        "method":           "POST",
                        "summary":          "Upload product image",
                        "type":             "ProductImage",
                        "nickname":         "product_image_upload",
                        "parameters":       [
                            {
                                "name":        "productId",
                                "description": "ID of the product",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            },
                            {
                                "name":        "file",
                                "description": "Image file that needs to be uploaded",
                                "required":    true,
                                "type":        "file",
                                "paramType":   "form"
                            },
                            {
                                "name":        "priority",
                                "description": "Priority of the image",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "form"
                            },
                            {
                                "name":        "is_public",
                                "description": "Show image or not",
                                "required":    true,
                                "type":        "boolean",
                                "paramType":   "form"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          201,
                                "message":       "Image was created",
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
            }
        ],
        "models":         {
            "Product":           require('../models/product'),
            "ProductRequest":    require('../models/request/product'),
            "Image":             require('../models/image'),
            "ProductImage":      require('../models/product_image'),
            "Shop":              require('../models/shop'),
            "Category":          require('../models/category'),
            "ProductsList":      require('../collections/products'),
            "ProductImagesList": require('../collections/product_images'),
            "RequestError":      require('../errors/request'),
            "UnauthorizedError": require('../errors/unauthorized'),
            "NotFoundError":     require('../errors/not_found'),
            "ValidationError":   require('../errors/validation'),
            "FieldError":        require('../errors/field')
        }
    });
});

module.exports = router;