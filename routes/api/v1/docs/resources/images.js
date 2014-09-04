var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        "basePath":       "/",
        "resourcePath":   "/api/v1/image",
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
                "path":       "/api/v1/images",
                "operations": [
                    {
                        "method":           "POST",
                        "summary":          "Upload image",
                        "type":             "Image",
                        "nickname":         "upload",
                        "parameters":       [
                            {
                                "name":        "file",
                                "description": "Image file that needs to be uploaded",
                                "required":    true,
                                "type":        "file",
                                "paramType":   "form"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          201,
                                "message":       "Image was created",
                                "responseModel": "Image"
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
                "path":       "/api/v1/images/{imageId}",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "Read image",
                        "type":             "Image",
                        "nickname":         "read",
                        "parameters":       [
                            {
                                "name":        "imageId",
                                "description": "ID of the image that needs to be fetched",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "Image"
                            },
                            {
                                "code":          400,
                                "message":       "Bad request",
                                "responseModel": "RequestError"
                            },
                            {
                                "code":          404,
                                "message":       "Image not found",
                                "responseModel": "NotFoundError"
                            }
                        ]
                    },
                    {
                        "method":           "PUT",
                        "summary":          "Update image",
                        "type":             "Image",
                        "nickname":         "update",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "Image object that needs to be updated",
                                "required":    true,
                                "type":        "ImageRequest",
                                "paramType":   "body"
                            },
                            {
                                "name":        "imageId",
                                "description": "ID of the image that needs to be updated",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "Image"
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
                                "message":       "Image not found",
                                "responseModel": "NotFoundError"
                            }
                        ]
                    }
                ]
            }
        ],
        "models":         {
            "Image":             require('../models/image'),
            "ImageRequest":      require('../models/request/image'),
            "ImagesList":        require('../collections/images'),
            "RequestError":      require('../errors/request'),
            "UnauthorizedError": require('../errors/unauthorized'),
            "NotFoundError":     require('../errors/not_found'),
            "ValidationError":   require('../errors/validation'),
            "FieldError":        require('../errors/field')
        }
    });
});

module.exports = router;
