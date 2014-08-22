var bookshelf = require('../modules/bookshelf');

var Model = bookshelf.Model.extend({
    tableName: 'image'
});

module.exports = Model;