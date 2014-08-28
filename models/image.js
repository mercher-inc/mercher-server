var bookshelf = require('../modules/bookshelf');

var ImageModel = bookshelf.Model.extend(
    {
        tableName:     'image',
        hasTimestamps: true
    }
);

module.exports = ImageModel;
