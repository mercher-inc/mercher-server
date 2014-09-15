var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base'),
    UserModel = require('./user'),
    ShopModel = require('./shop'),
    OrderItemModel = require('./order_item'),
    OrderTotalModel = require('./order_total');

var OrderModel = BaseModel.extend(
    {
        tableName: 'order',
        defaults:  {
            managerId: null,
            status:    'draft',
            tax:       0
        },

        user:       function () {
            return this.belongsTo(UserModel);
        },
        shop:       function () {
            return this.belongsTo(ShopModel);
        },
        orderItems: function () {
            return this.hasMany(OrderItemModel);
        },
        total:      function () {
            return this.hasOne(OrderTotalModel, 'id');
        },

        initialize: function () {
            this.on('saving', this.copyFields);
        },

        copyFields: function () {
            var orderModel = this;
            return orderModel
                .load('shop')
                .then(function (orderModel) {
                    orderModel.set('tax', orderModel.related('shop').get('tax'));
                    return orderModel;
                });
        }
    }
);

module.exports = OrderModel;
