var bookshelf = require('../modules/bookshelf');

var Model = bookshelf.Model.extend({
    tableName: 'access_token',
    hasTimestamps: true
});

module.exports = Model;