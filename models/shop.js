var bookshelf = require('../modules/bookshelf');

var Model = bookshelf.Model.extend({
    tableName: 'shop',
    hasTimestamps: true
});

module.exports = Model;