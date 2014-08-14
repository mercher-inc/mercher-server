var express = require('express');
var router = express.Router();

var modelsSpecs = {
    "Image":     {
        "id":          "Image",
        "required":    [
            "id",
            "file",
            "is_active",
            "is_banned"
        ],
        "description": "Image model",
        "properties":  {
            "id":          {
                "type":   "integer",
                "format": "int32"
            },
            "title":       {
                "type":         "string",
                "defaultValue": null
            },
            "description": {
                "type":         "string",
                "defaultValue": null
            },
            "file":        {
                "type":         "string",
                "defaultValue": null
            },
            "is_active":   {
                "type":         "boolean",
                "defaultValue": true
            },
            "is_banned":   {
                "type":         "boolean",
                "defaultValue": false
            },
            "created_at":  {
                "type":         "string",
                "format":       "date-time",
                "defaultValue": null
            },
            "updated_at":  {
                "type":         "string",
                "format":       "date-time",
                "defaultValue": null
            }
        }
    },
    "User":      {
        "id":          "User",
        "required":    [
            "id",
            "email",
            "is_active",
            "is_banned"
        ],
        "description": "User model",
        "properties":  {
            "id":         {
                "type":   "integer",
                "format": "int32"
            },
            "image_id":   {
                "type":         "integer",
                "format":       "int32",
                "defaultValue": null
            },
            "first_name": {
                "type":         "string",
                "defaultValue": null
            },
            "last_name":  {
                "type":         "string",
                "defaultValue": null
            },
            "email":      {
                "type": "string"
            },
            "password":   {
                "type":         "string",
                "defaultValue": null
            },
            "last_login": {
                "type":         "string",
                "format":       "date-time",
                "defaultValue": null
            },
            "is_active":  {
                "type":         "boolean",
                "defaultValue": true
            },
            "is_banned":  {
                "type":         "boolean",
                "defaultValue": false
            },
            "created_at": {
                "type":         "string",
                "format":       "date-time",
                "defaultValue": null
            },
            "updated_at": {
                "type":         "string",
                "format":       "date-time",
                "defaultValue": null
            },
            "image":      {
                "$ref":         "Image",
                "defaultValue": null
            }
        }
    },
    "Shop":      {
        "id":          "Shop",
        "required":    [
            "id",
            "title",
            "is_active",
            "is_banned"
        ],
        "description": "Shop model",
        "properties":  {
            "id":          {
                "type":   "integer",
                "format": "int32"
            },
            "image_id":    {
                "type":         "integer",
                "format":       "int32",
                "defaultValue": null
            },
            "title":       {
                "type": "string"
            },
            "description": {
                "type":         "string",
                "defaultValue": null
            },
            "location":    {
                "type":         "string",
                "defaultValue": null
            },
            "tax":         {
                "type":         "number",
                "format":       "float",
                "defaultValue": null
            },
            "rating":      {
                "type":         "number",
                "format":       "float",
                "defaultValue": null
            },
            "is_active":   {
                "type":         "boolean",
                "defaultValue": true
            },
            "is_banned":   {
                "type":         "boolean",
                "defaultValue": false
            },
            "created_at":  {
                "type":         "string",
                "format":       "date-time",
                "defaultValue": null
            },
            "updated_at":  {
                "type":         "string",
                "format":       "date-time",
                "defaultValue": null
            },
            "image":       {
                "$ref":         "Image",
                "defaultValue": null
            }
        }
    },
    "UsersList": {
        "id":          "UsersList",
        "required":    [
            "users",
            "total"
        ],
        "description": "Users collection",
        "properties":  {
            "users": {
                "type":  "array",
                "items": {
                    "$ref": "User"
                }
            },
            "total": {
                "type":   "integer",
                "format": "int32"
            }
        }
    },
    "ShopsList": {
        "id":          "ShopsList",
        "required":    [
            "shops",
            "total"
        ],
        "description": "Shops collection",
        "properties":  {
            "shops": {
                "type":  "array",
                "items": {
                    "$ref": "Shop"
                }
            },
            "total": {
                "type":   "integer",
                "format": "int32"
            }
        }
    }
};

router.get('/', function (req, res) {
    res.json({
        "apiVersion":     "1.0",
        "swaggerVersion": "1.2",
        "apis":           [
            {
                "path":        "/users",
                "description": "User resource"
            },
            {
                "path":        "/shops",
                "description": "Shop resource"
            }
        ],
        "info":           {
            "title":       "Mercher API Documentation",
            "description": "Mercher API Documentation",
            "contact":     "support@mercher.net"
        }
    });
});

router.get('/users', function (req, res) {
    res.json({
        "basePath":     "/",
        "resourcePath": "/api/v1/user",
        "apiVersion":   "1.0",
        "apis":         [
            {
                "path":       "/api/v1/users",
                "operations": [
                    {
                        "method":   "GET",
                        "summary":  "List users",
                        "type":     "UsersList",
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
                        "summary":          "Create user",
                        "type":             "User",
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
                                "description": "User object that needs to be created",
                                "required":    true,
                                "type":        "User",
                                "paramType":   "body"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          201,
                                "message":       "User was created",
                                "responseModel": "User"
                            }
                        ]
                    }
                ]
            },
            {
                "path":       "/api/v1/users/{userId}",
                "operations": [
                    {
                        "method":           "GET",
                        "summary":          "Read user",
                        "type":             "User",
                        "nickname":         "read",
                        "parameters":       [
                            {
                                "name":        "userId",
                                "description": "ID of the user that needs to be fetched",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "User"
                            },
                            {
                                "code":    400,
                                "message": "Invalid ID supplied"
                            },
                            {
                                "code":    404,
                                "message": "User not found"
                            }
                        ]
                    },
                    {
                        "method":           "PUT",
                        "summary":          "Update user",
                        "type":             "User",
                        "nickname":         "update",
                        "parameters":       [
                            {
                                "name":        "body",
                                "description": "User object that needs to be updated",
                                "required":    true,
                                "type":        "User",
                                "paramType":   "body"
                            },
                            {
                                "name":        "userId",
                                "description": "ID of the user that needs to be updated",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":          200,
                                "message":       "OK",
                                "responseModel": "User"
                            },
                            {
                                "code":    400,
                                "message": "Invalid ID supplied"
                            },
                            {
                                "code":    404,
                                "message": "User not found"
                            }
                        ]
                    },
                    {
                        "method":           "DELETE",
                        "summary":          "Delete user",
                        "type":             "void",
                        "nickname":         "delete",
                        "parameters":       [
                            {
                                "name":        "userId",
                                "description": "ID of the user that needs to be deleted",
                                "required":    true,
                                "type":        "integer",
                                "paramType":   "path"
                            }
                        ],
                        "responseMessages": [
                            {
                                "code":    200,
                                "message": "User was deleted"
                            },
                            {
                                "code":    400,
                                "message": "Invalid ID supplied"
                            },
                            {
                                "code":    404,
                                "message": "User not found"
                            }
                        ]
                    }
                ]
            }
        ],
        "models":       {
            "User":      modelsSpecs.User,
            "Image":     modelsSpecs.Image,
            "UsersList": modelsSpecs.UsersList
        }
    });
});

router.get('/shops', function (req, res) {
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
            "Shop":      modelsSpecs.Shop,
            "Image":     modelsSpecs.Image,
            "ShopsList": modelsSpecs.ShopsList
        }
    });
});

module.exports = router;
