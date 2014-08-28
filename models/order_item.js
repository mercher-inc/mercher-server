var bookshelf = require('../modules/bookshelf');

var OrderItemModel = bookshelf.Model.extend(
    {
        tableName:     'order_item',
        hasTimestamps: true
    }
);

module.exports = OrderItemModel;
