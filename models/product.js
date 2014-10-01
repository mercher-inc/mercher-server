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
        defaults:  {
            shopId:                 null,
            categoryId:             null,
            title:                  null,
            description:            null,
            rating:                 null,
            brand:                  null,
            manufacturerPartNumber: null,
            ean:                    null,
            isbn:                   null,
            upc:                    null,
            price:                  null,
            shippingCost:           null,
            shippingWeight:         null,
            shippingWeightUnits:    'kg',
            weight:                 null,
            weightUnits:            'kg',
            amountInStock:          null,
            availability:           'inStock',
            condition:              'new',
            ageGroup:               null,
            targetGender:           null,
            expirationTime:         null,
            color:                  null,
            material:               null,
            pattern:                null,
            size:                   null,
            isUnique:               false,
            isPublic:               true,
            isBanned:               false,
            createdAt:              null,
            updatedAt:              null
        },

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

        initialize: function () {
            this.on('updated', function () {
                io.sockets.emit('product updated', this);
            });
        }
    }
);

module.exports = ProductModel;

