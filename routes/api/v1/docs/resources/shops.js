var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
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
            "Shop":      require('../models/shop'),
            "Image":     require('../models/image'),
            "ShopsList": require('../collections/shops')
        }
    });
});

module.exports = router;
