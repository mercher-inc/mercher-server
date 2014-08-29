var bookshelf = require('../modules/bookshelf'),
    OrderItemModel = require('../models/order_item');

var OrderItemsCollection = bookshelf.Collection.extend(
    {
        model: OrderItemModel
    }
);

module.exports = OrderItemsCollection;
