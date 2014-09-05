var bookshelf = require('../modules/bookshelf'),
    BaseModel = require('./base');

var OrderItemModel = BaseModel.extend(
    {
        tableName:     'order_item',
        hasTimestamps: true,
        order:         function () {
            return this.belongsTo(require('./order'));
        },
        product:       function () {
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
                        'price':         orderItemModel.related('product').get('price'),
                        'shipping_cost': orderItemModel.related('product').get('shipping_cost')
                    });
                    return orderItemModel;
                });
        }
    }
);

module.exports = OrderItemModel;
