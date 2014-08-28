var bookshelf = require('../modules/bookshelf');

var ProductModel = bookshelf.Model.extend(
    {
        tableName:     'product',
        hasTimestamps: true
    }
);

module.exports = ProductModel;
