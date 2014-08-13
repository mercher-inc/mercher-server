var bookshelf = require('../modules/bookshelf');

var Model = bookshelf.Model.extend({
    tableName: 'user'
});

module.exports = Model;