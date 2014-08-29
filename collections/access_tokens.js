var bookshelf = require('../modules/bookshelf'),
    AccessTokenModel = require('../models/access_token');

var AccessTokensCollection = bookshelf.Collection.extend(
    {
        model: AccessTokenModel
    }
);

module.exports = AccessTokensCollection;
