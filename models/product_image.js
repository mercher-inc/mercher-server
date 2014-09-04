var bookshelf = require('../modules/bookshelf'),
    BaseModel = require('./base'),
    ImageModel = require('./image'),
    ProductModel = require('./product');

var ProductImageModel = BaseModel.extend(
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
