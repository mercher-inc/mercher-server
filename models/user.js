var bookshelf = require('../modules/bookshelf');

var Model = bookshelf.Model.extend({
    tableName: 'user',
    hasTimestamps: true
});

module.exports = Model;