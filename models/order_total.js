var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base'),
    OrderModel = require('./order');

var OrderTotalModel = BaseModel.extend(
    {
        tableName: 'order_total',

        order: function () {
            return this.hasOne(OrderModel, 'id');
        }
    }
);

module.exports = OrderTotalModel;
