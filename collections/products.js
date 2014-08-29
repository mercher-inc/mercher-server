var bookshelf = require('../modules/bookshelf'),
    ProductModel = require('../models/product');

var ProductsCollection = bookshelf.Collection.extend(
    {
        model: ProductModel
    }
);

module.exports = ProductsCollection;
