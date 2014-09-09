var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base');

var OrderItemModel = BaseModel.extend(
    {
        tableName: 'order_item',

        order:   function () {
            return this.belongsTo(require('./order'));
        },
        product: function () {
            return this.belongsTo(require('./product'));
        },

        initialize: function () {
            this.on('saving', this.copyFields);
        },

        copyFields: function () {
            var orderItemModel = this;
            return orderItemModel
                .load('product')
                .then(function (orderItemModel) {
                    orderItemModel.set({
                        'price':        orderItemModel.related('product').get('price'),
                        'shippingCost': orderItemModel.related('product').get('shippingCost')
                    });
                    return orderItemModel;
                });
        }
    }
);

module.exports = OrderItemModel;
