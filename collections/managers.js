var bookshelf = require('../modules/bookshelf'),
    ManagerModel = require('../models/manager');

var ManagersCollection = bookshelf.Collection.extend(
    {
        model: ManagerModel
    }
);

module.exports = ManagersCollection;
