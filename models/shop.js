var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base'),
    Promise = require("bluebird"),
    ImageModel = require('./image'),
    expressAsyncValidator = require('../modules/express-async-validator/module');

var ShopModel = BaseModel.extend(
    {
        tableName: 'shop',
        defaults:  {
            imageId:     null,
            description: null,
            location:    null,
            tax:         0,
            isPublic:    true,
            isBanned:    false
        },

        image: function () {
            return this.belongsTo(ImageModel);
        },

        payPalAccounts: function () {
            return this.belongsToMany(require('./paypal_account'), 'shop_paypal_account');
        },

        initialize:       function () {
            this.on('creating', this.validateCreating);
            this.on('updating', this.validateUpdating);
            this.on('updated', function () {
                io.sockets.emit('shop updated', this);
            });
        },
        validateCreating: function (shopModel, attrs, options) {
            return new Promise(function (resolve, reject) {
                new (expressAsyncValidator.model)(validateCreatingConfig)
                    .validate(attrs)
                    .then(function (attrs) {
                        resolve(attrs);
                    })
                    .catch(expressAsyncValidator.errors.modelValidationError, function (error) {
                        reject(new ShopModel.ValidationError("Shop validation failed", error.fields));
                    })
                    .catch(function () {
                        reject(new ShopModel.InternalServerError());
                    });
            });
        },
        validateUpdating: function (shopModel, attrs, options) {
            return new Promise(function (resolve, reject) {
                shopModel
                    .checkPermission(options.req.currentUser, 'owner')
                    .then(function () {
                        new (expressAsyncValidator.model)(validateUpdatingConfig)
                            .validate(attrs)
                            .then(function (attrs) {
                                resolve(attrs);
                            })
                            .catch(expressAsyncValidator.errors.modelValidationError, function (error) {
                                reject(new ShopModel.ValidationError("Shop validation failed", error.fields));
                            })
                            .catch(function () {
                                reject(new ShopModel.InternalServerError());
                            });
                    })
                    .catch(ShopModel.PermissionError, function (error) {
                        reject(new ShopModel.PermissionError("You are not allowed to modify this shop"));
                    })
                    .catch(function () {
                        reject(new ShopModel.InternalServerError());
                    });
            });
        },
        checkPermission:  function (currentUserModel, role) {
            var shopModel = this,
                shopId = shopModel.get('id'),
                userId = currentUserModel.get('id');
            return new Promise(function (resolve, reject) {
                ShopModel
                    .checkPermission(shopId, userId, role)
                    .then(function () {
                        resolve(shopModel);
                    })
                    .catch(function () {
                        reject(new ShopModel.PermissionError());
                    });
            });
        }
    }
);

var validateCreatingConfig = {
    "imageId":     {
        "rules":        {
            "isInt": {
                "message": "Image ID should be integer"
            },
            "toInt": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "title":       {
        "rules":      {
            "required": {
                "message": "Shop's title is required"
            },
            "toString": {},
            "trim":     {},
            "escape":   {},
            "isLength": {
                "message": "Shop's title should be at least 3 characters long and less then 250 characters",
                "min":     3,
                "max":     250
            }
        },
        "allowEmpty": false
    },
    "description": {
        "rules":        {
            "toString": {},
            "escape":   {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "location":    {
        "rules":        {
            "toString": {},
            "trim":     {},
            "escape":   {},
            "isLength": {
                "message": "Shop's location should be at least 3 characters long and less then 250 characters",
                "min":     3,
                "max":     250
            }
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "tax":         {
        "rules":        {
            "isFloat": {
                "message": "Tax should be float"
            },
            "toFloat": {}
        },
        "allowEmpty":   true,
        "defaultValue": 0
    },
    "isPublic":    {
        "rules":        {
            "toBoolean": {}
        },
        "allowEmpty":   true,
        "defaultValue": false
    }
};

var validateUpdatingConfig = {
    "imageId":     {
        "rules":        {
            "isInt": {
                "message": "Image ID should be integer"
            },
            "toInt": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "title":       {
        "rules":      {
            "required": {
                "message": "Shop's title is required"
            },
            "toString": {},
            "trim":     {},
            "escape":   {},
            "isLength": {
                "message": "Shop's title should be at least 3 characters long and less then 250 characters",
                "min":     3,
                "max":     250
            }
        },
        "allowEmpty": false
    },
    "description": {
        "rules":        {
            "toString": {},
            "escape":   {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "location":    {
        "rules":        {
            "toString": {},
            "trim":     {},
            "escape":   {},
            "isLength": {
                "message": "Shop's location should be at least 3 characters long and less then 250 characters",
                "min":     3,
                "max":     250
            }
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "tax":         {
        "rules":        {
            "isFloat": {
                "message": "Tax should be float"
            },
            "toFloat": {}
        },
        "allowEmpty":   true,
        "defaultValue": 0
    },
    "isPublic":    {
        "rules":        {
            "toBoolean": {}
        },
        "allowEmpty":   true,
        "defaultValue": false
    }
};

module.exports = ShopModel;
