var bookshelf = require('../modules/bookshelf');

var ProductImageModel = bookshelf.Model.extend(
    {
        tableName:     'product_image',
        hasTimestamps: true
    }
);

module.exports = ProductImageModel;
