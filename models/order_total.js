var Bookshelf = require('../modules/bookshelf'),
    OrderModel = require('./order');

var OrderTotalModel = Bookshelf.Model.extend(
    {
        tableName:     'order_total',
        hasTimestamps: true,
        order:          function () {
            return this.hasOne(OrderModel, 'id');
        }
    }
);

module.exports = OrderTotalModel;
