var bookshelf = require('../modules/bookshelf'),
    UserModel = require('../models/user');

var UsersCollection = bookshelf.Collection.extend(
    {
        model: UserModel
    }
);

module.exports = UsersCollection;
