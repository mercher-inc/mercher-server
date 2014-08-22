var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.json({
        "basePath":       "/",
        "resourcePath":   "/api/v1/craftsman",
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
                "path":       "/api/v1/craftsmen",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "List craftsmen",
                        "type":             "CraftsmenList",
                        "nickname":         "list",
                        "parameters":       [
                            {
                                "name":        "limit",
                                "description": "Amount of craftsmen to fetch",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            },
                            {
                                "name":        "offset",
                                "description": "Amount of craftsmen to skip",
                                "required":    false,
                                "type":        "integer",
                                "paramType":   "query"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "CraftsmenList"
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
                        "summary":          "Create craftsman",
                        "type":             "Craftsman",
                        "nickname":         "create",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "Craftsman object that needs to be created",
                                "required":    true,
                                "type":        "Craftsman",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          201,
                                "message":       "Craftsman was created",
                                "responseModel": "Craftsman"
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
                "path":       "/api/v1/craftsmen/{craftsmanId}",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "Read craftsman",
                        "type":             "Craftsman",
                        "nickname":         "read",
                        "parameters":       [
                            {
                                "name":        "craftsmanId",
                                "description": "ID of the craftsman that needs to be fetched",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "Craftsman"
                            },
                            {
                                "code":          400,
                                "message":       "Bad request",
                                "responseModel": "RequestError"
                            },
                            {
                                "code":          404,
                                "message":       "Craftsman not found",
                                "responseModel": "NotFoundError"
                            }
                        ]
                    },
                    {
                        "method":           "PUT",
                        "summary":          "Update craftsman",
                        "type":             "Craftsman",
                        "nickname":         "update",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "Craftsman object that needs to be updated",
                                "required":    true,
                                "type":        "Craftsman",
                                "paramType":   "body"
                            },
                            {
                                "name":        "craftsmanId",
                                "description": "ID of the craftsman that needs to be updated",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "Craftsman"
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
                                "message":       "Craftsman not found",
                                "responseModel": "NotFoundError"
                            }
                        ]
                    },
                    {
                        "method":           "DELETE",
                        "summary":          "Delete craftsman",
                        "type":             "void",
                        "nickname":         "delete",
                        "parameters":       [
                            {
                                "name":        "craftsmanId",
                                "description": "ID of the craftsman that needs to be deleted",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":    200,
                                "message": "Craftsman was deleted"
                            },
                            {
                                "code":          400,
                                "message":       "Bad request",
                                "responseModel": "RequestError"
                            },
                            {
                                "code":          404,
                                "message":       "Craftsman not found",
                                "responseModel": "NotFoundError"
                            }
                        ]
                    }
                ]
            }
        ],
        "models":         {
            "Craftsman":         require('../models/craftsman'),
            "Image":             require('../models/image'),
            "CraftsmenList":     require('../collections/craftsmen'),
            "RequestError":      require('../errors/request'),
            "UnauthorizedError": require('../errors/unauthorized'),
            "NotFoundError":     require('../errors/not_found'),
            "ValidationError":   require('../errors/validation'),
            "FieldError":        require('../errors/field')
        }
    });
});

module.exports = router;
