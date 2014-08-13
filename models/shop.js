var bookshelf = require('../modules/bookshelf');

var Model = bookshelf.Model.extend({
    tableName: 'shop'
});

module.exports = Model;