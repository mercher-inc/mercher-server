var bookshelf = require('../modules/bookshelf'),
    ShopModel = require('./shop');

var ProductModel = bookshelf.Model.extend(
    {
        tableName:     'product',
        hasTimestamps: true,
        shop:          function () {
            return this.belongsTo(ShopModel);
        }
    }
);

module.exports = ProductModel;
