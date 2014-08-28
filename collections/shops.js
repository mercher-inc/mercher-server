var bookshelf = require('../modules/bookshelf'),
    ShopModel = require('../models/shop');

var ShopsCollection = bookshelf.Collection.extend(
    {
        model: ShopModel
    }
);

module.exports = ShopsCollection;
