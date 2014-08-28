var bookshelf = require('../modules/bookshelf');

var CategoryModel = bookshelf.Model.extend(
    {
        tableName:     'category',
        hasTimestamps: true
    }
);

module.exports = CategoryModel;
