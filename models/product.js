var bookshelf = require('../modules/bookshelf'),
    Promise = require("bluebird"),
    ShopModel = require('./shop'),
    expressAsyncValidator = require('../modules/express-async-validator/module');

var ProductModel = bookshelf.Model.extend(
    {
        tableName:     'product',
        hasTimestamps: true,
        shop:          function () {
            return this.belongsTo(ShopModel);
        },

        initialize:       function () {
            this.on('creating', this.validateCreating);
            this.on('updating', this.validateUpdating);
        },
        validateCreating: function (model, attrs, options) {
            return new (expressAsyncValidator.model)(validateCreatingConfig)
                .validate(attrs);
        },
        validateUpdating: function (model, attrs, options) {
            return new (expressAsyncValidator.model)(validateUpdatingConfig)
                .validate(attrs);
        }
    }
);

var validateCreatingConfig = {
    "shop_id":         {
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
    "category_id":     {
        "rules":        {
            "isInt": {
                "message": "Category ID should be integer"
            },
            "toInt": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "title":           {
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
    "description":     {
        "rules":        {
            "toString": {},
            "escape":   {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "price":           {
        "rules":        {
            "isFloat": {
                "message": "Price should be float"
            },
            "toFloat": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "shipping_cost":   {
        "rules":        {
            "isFloat": {
                "message": "Shipping cost should be float"
            },
            "toFloat": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "shipping_weight": {
        "rules":        {
            "isFloat": {
                "message": "Shipping weight should be float"
            },
            "toFloat": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "amount_in_stock": {
        "rules":        {
            "isInt": {
                "message": "Amount in stock should be integer"
            },
            "toInt": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "is_unique":       {
        "rules":        {
            "toBoolean": {}
        },
        "allowEmpty":   true,
        "defaultValue": false
    },
    "is_public":       {
        "rules":        {
            "toBoolean": {}
        },
        "allowEmpty":   true,
        "defaultValue": false
    }
};

var validateUpdatingConfig = {
    "shop_id":         {
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
    "category_id":     {
        "rules":        {
            "isInt": {
                "message": "Category ID should be integer"
            },
            "toInt": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "title":           {
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
    "description":     {
        "rules":        {
            "toString": {},
            "escape":   {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "price":           {
        "rules":        {
            "isFloat": {
                "message": "Price should be float"
            },
            "toFloat": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "shipping_cost":   {
        "rules":        {
            "isFloat": {
                "message": "Shipping cost should be float"
            },
            "toFloat": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "shipping_weight": {
        "rules":        {
            "isFloat": {
                "message": "Shipping weight should be float"
            },
            "toFloat": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "amount_in_stock": {
        "rules":        {
            "isInt": {
                "message": "Amount in stock should be integer"
            },
            "toInt": {}
        },
        "allowEmpty":   true,
        "defaultValue": null
    },
    "is_unique":       {
        "rules":        {
            "toBoolean": {}
        },
        "allowEmpty":   true,
        "defaultValue": false
    },
    "is_public":       {
        "rules":        {
            "toBoolean": {}
        },
        "allowEmpty":   true,
        "defaultValue": false
    }
};

module.exports = ProductModel;
