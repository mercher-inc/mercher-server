var express = require('express'),
    bodyParser = require('body-parser'),
    swagger = require("swagger-node-express");

var app = express();
app.set('APP_ROOT', __dirname);
app.use(bodyParser());
swagger.setAppHandler(app);
swagger.configureSwaggerPaths("", "/api/docs", "");
swagger.setApiInfo({
    "title":       "Mercher API",
    "description": "This is Mercher API documentation",
    "contact":     "support@mercher.net"
});
swagger.allModels = {
    "Image": {
        "id":          "Image",
        "required":    ["id", "file", "is_active", "is_banned"],
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
    "User":  {
        "id":          "User",
        "required":    ["id", "email", "is_active", "is_banned"],
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
    "Shop":  {
        "id":          "Shop",
        "required":    ["id", "title", "is_active", "is_banned"],
        "description": "Shop model",
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
            "title": {
                "type":         "string"
            },
            "description":  {
                "type":         "string",
                "defaultValue": null
            },
            "location":      {
                "type": "string",
                "defaultValue": null
            },
            "tax":   {
                "type":         "number",
                "format":       "float",
                "defaultValue": null
            },
            "rating":   {
                "type":         "number",
                "format":       "float",
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
    }
};

swagger.resources['user'] = {
    basePath:     '/',
    resourcePath: '/api/v1/user',
    "apis":       [
        {
            "path":       "/api/v1/users",
            "operations": [
                {
                    "method":   "GET",
                    "summary":  "List users",
                    "type":     "User",
                    "nickname": "listUsers",
                    "consumes": ["application/json"],
                    "produces": ["application/json"]
                },
                {
                    "method":           "POST",
                    "summary":          "Create user",
                    "type":             "User",
                    "nickname":         "createUser",
                    "consumes":         ["application/json"],
                    "produces":         ["application/json"],
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
                    "nickname":         "readUser",
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
                    "nickname":         "updateUser",
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
                    "nickname":         "deleteUser",
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
    ]
};
swagger.resources['shop'] = {
    basePath:     '/',
    resourcePath: '/api/v1/shop',
    "apis":       [
        {
            "path":       "/api/v1/shops",
            "operations": [
                {
                    "method":   "GET",
                    "summary":  "List shops",
                    "type":     "Shop",
                    "nickname": "listShops",
                    "consumes": ["application/json"],
                    "produces": ["application/json"]
                },
                {
                    "method":           "POST",
                    "summary":          "Create shop",
                    "type":             "Shop",
                    "nickname":         "createShop",
                    "consumes":         ["application/json"],
                    "produces":         ["application/json"],
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
                    "nickname":         "readShop",
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
                    "nickname":         "updateShop",
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
                    "nickname":         "deleteShop",
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
    ]
};

swagger.configure("/", "1.0");

console.log(swagger);

app.set('bookshelf', require('./modules/bookshelf'));

app.set('port', 3000);

var server = require('http').createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
var io = require('socket.io')(server);

app.use('/swagger', express.static(__dirname + '/node_modules/swagger-ui/dist'));

app.use('/api/v1', require('./routes/api/v1'));

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log('a user connected', socket.id/*, socket.request.headers*/);
    socket.on('disconnect', function () {
        console.log('user disconnected', socket.id);
    });

    socket.on('app_started', function (socket) {
        console.log('app started', socket.id);
    });
});

module.exports = app;