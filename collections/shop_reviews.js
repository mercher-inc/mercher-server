var bookshelf = require('../modules/bookshelf'),
    ShopReviewModel = require('../models/shop_review');

var ShopReviewsCollection = bookshelf.Collection.extend(
    {
        model: ShopReviewModel
    }
);

module.exports = ShopReviewsCollection;
