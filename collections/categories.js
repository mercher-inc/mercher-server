var bookshelf = require('../modules/bookshelf'),
    CategoryModel = require('../models/category');

var CategoriesCollection = bookshelf.Collection.extend(
    {
        model: CategoryModel
    }
);

module.exports = CategoriesCollection;
