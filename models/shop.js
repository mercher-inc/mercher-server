var bookshelf = require('../modules/bookshelf'),
    ImageModel = require('./image');

var ShopModel = bookshelf.Model.extend(
    {
        tableName:     'shop',
        hasTimestamps: true,

        image:         function () {
            return this.belongsTo(ImageModel);
        }
    }
);

module.exports = ShopModel;
