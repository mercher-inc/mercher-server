var bookshelf = require('../modules/bookshelf');

var ManagerModel = bookshelf.Model.extend(
    {
        tableName:     'manager',
        hasTimestamps: true
    }
);

module.exports = ManagerModel;
