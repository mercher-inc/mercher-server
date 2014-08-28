var bookshelf = require('../modules/bookshelf');

var OrderModel = bookshelf.Model.extend(
    {
        tableName:     'order',
        hasTimestamps: true
    }
);

module.exports = OrderModel;
