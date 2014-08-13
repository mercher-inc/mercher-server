var bookshelf = require('../modules/bookshelf');

var Collection = bookshelf.Collection.extend({
    model: require('../models/user')
});

module.exports = Collection;