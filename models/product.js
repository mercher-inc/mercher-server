var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base'),
    Promise = require("bluebird"),
    ShopModel = require('./shop'),
    CategoryModel = require('./category'),
    OrderItemModel = require('./order_item'),
    ProductImageModel = require('./product_image'),
    expressAsyncValidator = require('../modules/express-async-validator/module');

var ProductModel = BaseModel.extend(
    {
        tableName: 'product',

        shop:          function () {
            return this.belongsTo(ShopModel);
        },
        category:      function () {
            return this.belongsTo(CategoryModel);
        },
        orderItems:    function () {
            return this.hasMany(OrderItemModel);
        },
        productImages: function () {
            return this.hasMany(ProductImageModel);
        },

        initialize:       function () {
            this.on('creating', this.validateCreating);
            this.on('updating', this.validateUpdating);
            this.on('updated', function () {
                io.sockets.emit('product updated', this);
            });
        },
        validateCreating: function (productModel, attrs, options) {
            return new Promise(function (resolve, reject) {
                new (expressAsyncValidator.model)(validateCreatingConfig)
                    .validate(attrs)
                    .then(function (attrs) {
                        productModel
                            .checkPermission(options.req.currentUser, 'editor')
                            .then(function () {
                                resolve(attrs);
                            })
                            .catch(ProductModel.PermissionError, function (error) {
                                reject(new ProductModel.PermissionError("You are not allowed to create new products in this shop"));
                            })
                            .catch(function () {
                                reject(new ProductModel.InternalServerError());
                            });
                    })
                    .catch(expressAsyncValidator.errors.modelValidationError, function (error) {
                        reject(new ProductModel.ValidationError("Product validation failed", error.fields));
                    })
                    .catch(function () {
                        reject(new ProductModel.InternalServerError());
                    });
            });
        },
        validateUpdating: function (productModel, attrs, options) {
            return new Promise(function (resolve, reject) {
                productModel
                    .checkPermission(options.req.currentUser, 'editor')
                    .then(function () {
                        new (expressAsyncValidator.model)(validateUpdatingConfig)
                            .validate(attrs)
                            .then(function (attrs) {
                                resolve(attrs);
                            })
                            .catch(expressAsyncValidator.errors.modelValidationError, function (error) {
                                reject(new ProductModel.ValidationError("Product validation failed", error.fields));
                            })
                            .catch(function () {
                                reject(new ProductModel.InternalServerError());
                            });
                    })
                    .catch(ProductModel.PermissionError, function (error) {
                        reject(new ProductModel.PermissionError("You are not allowed to modify this product"));
                    })
                    .catch(function () {
                        reject(new ProductModel.InternalServerError());
                    });
            });
        },
        checkPermission:  function (currentUserModel, role) {
            var productModel = this,
                shopId = productModel.isNew() ? productModel.get('shopId') : productModel.previous('shopId'),
                userId = currentUserModel.get('id');
            return new Promise(function (resolve, reject) {
                ProductModel
                    .checkPermission(shopId, userId, role)
                    .then(function () {
                        resolve(productModel);
                    })
                    .catch(function () {
                        reject(new ProductModel.PermissionError());
                    });
            });
        }
    }
);

var validateCreatingConfig = {
    "shopId":         {
        "rules":      {
            "required": {
                "message": "Shop ID is required"
            },
            "isInt":    {
                "message": "Shop ID should be integer"
            },
            "toInt":    {}
        },
        "allowEmpty": false
    },
    "categoryId":     {
        "rules":        {
            "isInt": {
                "message": "Category ID should be integer"
            },
            "toInt": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "title":          {
        "rules":      {
            "required": {
                "message": "Product's title is required"
            },
            "toString": {},
            "trim":     {},
            "escape":   {},
            "isLength": {
                "message": "Product's title should be at least 3 characters long and less then 250 characters",
                "min":     3,
                "max":     250
            }
        },
        "allowEmpty": false
    },
    "description":    {
        "rules":        {
            "toString": {},
            "escape":   {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "price":          {
        "rules":        {
            "isFloat": {
                "message": "Price should be float"
            },
            "toFloat": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "shippingCost":   {
        "rules":        {
            "isFloat": {
                "message": "Shipping cost should be float"
            },
            "toFloat": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "shippingWeight": {
        "rules":        {
            "isFloat": {
                "message": "Shipping weight should be float"
            },
            "toFloat": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "amountInStock":  {
        "rules":        {
            "isInt": {
                "message": "Amount in stock should be integer"
            },
            "toInt": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "isUnique":       {
        "rules":        {
            "toBoolean": {}
        },
        "allowEmpty":   true,
        "defaultValue": false
    },
    "isPublic":       {
        "rules":        {
            "toBoolean": {}
        },
        "allowEmpty":   true,
        "defaultValue": false
    }
};

var validateUpdatingConfig = {
    "shopId":         {
        "rules":      {
            "required": {
                "message": "Shop ID is required"
            },
            "isInt":    {
                "message": "Shop ID should be integer"
            },
            "toInt":    {}
        },
        "allowEmpty": false
    },
    "categoryId":     {
        "rules":        {
            "isInt": {
                "message": "Category ID should be integer"
            },
            "toInt": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "title":          {
        "rules":      {
            "required": {
                "message": "Product's title is required"
            },
            "toString": {},
            "trim":     {},
            "escape":   {},
            "isLength": {
                "message": "Product's title should be at least 3 characters long and less then 250 characters",
                "min":     3,
                "max":     250
            }
        },
        "allowEmpty": false
    },
    "description":    {
        "rules":        {
            "toString": {},
            "escape":   {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "price":          {
        "rules":        {
            "isFloat": {
                "message": "Price should be float"
            },
            "toFloat": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "shippingCost":   {
        "rules":        {
            "isFloat": {
                "message": "Shipping cost should be float"
            },
            "toFloat": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "shippingWeight": {
        "rules":        {
            "isFloat": {
                "message": "Shipping weight should be float"
            },
            "toFloat": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "amountInStock":  {
        "rules":        {
            "isInt": {
                "message": "Amount in stock should be integer"
            },
            "toInt": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "isUnique":       {
        "rules":        {
            "toBoolean": {}
        },
        "allowEmpty":   true,
        "defaultValue": false
    },
    "isPublic":       {
        "rules":        {
            "toBoolean": {}
        },
        "allowEmpty":   true,
        "defaultValue": false
    }
};

module.exports = ProductModel;
