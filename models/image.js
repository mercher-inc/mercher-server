var bookshelf = require('../modules/bookshelf');

var Model = bookshelf.Model.extend({
    tableName: 'image',
    hasTimestamps: true
});

module.exports = Model;