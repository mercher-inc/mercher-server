var bookshelf = require('../modules/bookshelf'),
    OrderModel = require('../models/order');

var OrdersCollection = bookshelf.Collection.extend(
    {
        model: OrderModel
    }
);

module.exports = OrdersCollection;
