var bookshelf = require('../modules/bookshelf'),
    BaseModel = require('./base'),
    ProductModel = require('./product'),
    OrderModel = require('./order');

var OrderItemModel = BaseModel.extend(
    {
        tableName:     'order_item',
        hasTimestamps: true,
        order:         function () {
            return this.belongsTo(OrderModel);
        },
        product:       function () {
            return this.belongsTo(ProductModel);
        }
    }
);

module.exports = OrderItemModel;
