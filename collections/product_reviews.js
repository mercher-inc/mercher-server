var bookshelf = require('../modules/bookshelf'),
    ProductReviewModel = require('../models/product_review');

var ProductReviewsCollection = bookshelf.Collection.extend(
    {
        model: ProductReviewModel
    }
);

module.exports = ProductReviewsCollection;
