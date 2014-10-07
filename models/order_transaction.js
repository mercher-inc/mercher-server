var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base'),
    OrderModel = require('./order');

var OrderTransactionModel = BaseModel.extend(
    {
        tableName: 'order_transaction',
        defaults:  {
            orderId:   null,
            data:      null,
            createdAt: null,
            updatedAt: null
        },

        order: function () {
            return this.hasOne(OrderModel, 'id');
        }
    }
);

module.exports = OrderTransactionModel;
