var bookshelf = require('../modules/bookshelf'),
    BaseModel = require('./base'),
    UserModel = require('./user'),
    ShopModel = require('./shop'),
    OrderItemModel = require('./order_item');

var OrderModel = BaseModel.extend(
    {
        tableName:     'order',
        hasTimestamps: true,
        user:          function () {
            return this.belongsTo(UserModel);
        },
        shop:          function () {
            return this.belongsTo(ShopModel);
        },
        orderItems:    function () {
            return this.hasMany(OrderItemModel);
        }
    }
);

module.exports = OrderModel;
