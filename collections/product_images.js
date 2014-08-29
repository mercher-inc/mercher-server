var bookshelf = require('../modules/bookshelf'),
    ProductImageModel = require('../models/product_image');

var ProductImagesCollection = bookshelf.Collection.extend(
    {
        model: ProductImageModel
    }
);

module.exports = ProductImagesCollection;
