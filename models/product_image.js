var bookshelf = require('../modules/bookshelf'),
    ImageModel = require('./image'),
    ProductModel = require('./product');

var ProductImageModel = bookshelf.Model.extend(
    {
        tableName:     'product_image',
        hasTimestamps: true,

        image:   function () {
            return this.belongsTo(ImageModel);
        },
        product: function () {
            return this.belongsTo(ProductModel);
        }
    }
);

module.exports = ProductImageModel;
